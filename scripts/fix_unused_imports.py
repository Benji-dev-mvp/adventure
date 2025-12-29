#!/usr/bin/env python3
"""
Remove unused imports from JavaScript/TypeScript files
Parses ESLint JSON output and removes truly unused imports
"""
import json
import re
import sys
from pathlib import Path

def remove_from_import(line, unused_vars):
    """Remove unused variables from an import statement"""
    # Pattern: import { A, B, C } from 'module'
    match = re.match(r"import\s*{([^}]+)}\s*from\s*['\"]([^'\"]+)['\"];?", line)
    if not match:
        return line
    
    imports_str = match.group(1)
    module = match.group(2)
    
    # Split imports and filter out unused
    imports = [i.strip() for i in imports_str.split(',')]
    kept_imports = [i for i in imports if not any(i.startswith(var) or i.endswith(f' as {var}') for var in unused_vars)]
    
    if not kept_imports:
        # Remove entire import line
        return None
    elif len(kept_imports) == len(imports):
        # No change needed
        return line
    else:
        # Reconstruct import with remaining variables
        return f"import {{ {', '.join(kept_imports)} }} from '{module}';\n"

def process_file(filepath, unused_vars):
    """Remove unused imports from a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        new_lines = []
        changes = 0
        
        for i, line in enumerate(lines, 1):
            # Check if this line has unused imports
            line_unused = [var for var, var_line in unused_vars if var_line == i]
            
            if line_unused and 'import' in line:
                new_line = remove_from_import(line, line_unused)
                if new_line is None:
                    # Skip this line entirely
                    changes += 1
                    continue
                elif new_line != line:
                    new_lines.append(new_line)
                    changes += 1
                else:
                    new_lines.append(line)
            else:
                new_lines.append(line)
        
        if changes > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            return changes
        return 0
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return 0

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 fix_unused_imports.py <eslint-json-report>")
        sys.exit(1)
    
    report_path = sys.argv[1]
    
    with open(report_path, 'r') as f:
        data = json.load(f)
    
    files_to_fix = {}
    
    for file_data in data:
        filepath = file_data['filePath']
        unused_imports = []
        
        for msg in file_data.get('messages', []):
            if msg.get('ruleId') == '@typescript-eslint/no-unused-vars':
                if 'is defined but never used' in msg['message']:
                    # Extract variable name
                    match = re.search(r"'([^']+)'", msg['message'])
                    if match:
                        var_name = match.group(1)
                        unused_imports.append((var_name, msg['line']))
        
        if unused_imports:
            files_to_fix[filepath] = unused_imports
    
    print(f"Found {len(files_to_fix)} files with unused imports")
    
    total_changes = 0
    for filepath, unused_vars in files_to_fix.items():
        changes = process_file(filepath, unused_vars)
        if changes > 0:
            short_path = filepath.split('codespaces-react/')[-1] if 'codespaces-react/' in filepath else filepath
            print(f"  {short_path}: removed {changes} unused imports")
            total_changes += changes
    
    print(f"\nTotal changes: {total_changes}")

if __name__ == '__main__':
    main()
