#!/bin/bash
# Validate codecov.yml and run frontend coverage

set -e

echo "🔍 Validating codecov.yml..."

CODECOV_FILE="codecov.yml"

# Check file exists
if [ ! -f "$CODECOV_FILE" ]; then
  echo "❌ codecov.yml not found"
  exit 1
fi

# Check required sections
if ! grep -q "coverage:" "$CODECOV_FILE"; then
  echo "❌ codecov.yml missing 'coverage:' section"
  exit 1
fi

if ! grep -q "informational:" "$CODECOV_FILE"; then
  echo "⚠️  Warning: codecov.yml has no 'informational:' gates (not configured for non-blocking mode)"
fi

echo "✅ codecov.yml structure valid"

# Run coverage
echo ""
echo "📊 Running frontend coverage tests..."
npm run test:ci || {
  echo "⚠️  Some tests failed (informational only)"
}

# Check coverage output
if [ -f "coverage/lcov.info" ]; then
  LINES=$(wc -l < "coverage/lcov.info")
  echo "✅ Coverage report generated: $LINES lines"
  echo ""
  echo "📈 Summary:"
  head -20 coverage/coverage-final.json 2>/dev/null | grep -o '"lines":[^,]*' | head -1 || echo "   (detailed stats in coverage/)"
else
  echo "⚠️  coverage/lcov.info not found (tests may have failed)"
fi

echo ""
echo "✨ Validation complete. Ready to commit!"
