import React from 'react';
import PropTypes from 'prop-types';
import { 
  Plus, 
  Save, 
  Play, 
  LayoutGrid, 
  Undo2, 
  Redo2,
  Download,
  Upload,
  Settings,
  Loader2
} from 'lucide-react';

const WorkflowToolbar = ({ 
  onAddNode, 
  onSave, 
  onExecute, 
  onAutoLayout,
  onUndo,
  onRedo,
  onExport,
  onImport,
  isExecuting = false,
  readOnly = false,
  nodeCount = 0,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
      {/* Add Node Button */}
      {!readOnly && (
        <button
          onClick={onAddNode}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Node
        </button>
      )}

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Undo/Redo */}
      {!readOnly && (
        <>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
        </>
      )}

      {/* Auto Layout */}
      <button
        onClick={onAutoLayout}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Auto Layout"
      >
        <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Import/Export */}
      <button
        onClick={onExport}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        title="Export Workflow"
      >
        <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
      
      {!readOnly && (
        <button
          onClick={onImport}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          title="Import Workflow"
        >
          <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Node Count */}
      <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
        {nodeCount} nodes
      </div>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

      {/* Save Button */}
      {!readOnly && (
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      )}

      {/* Execute Button */}
      <button
        onClick={onExecute}
        disabled={isExecuting || nodeCount === 0}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
          isExecuting
            ? 'bg-orange-500 text-white'
            : 'bg-green-500 text-white hover:bg-green-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isExecuting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Running...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Execute
          </>
        )}
      </button>
    </div>
  );
};

WorkflowToolbar.propTypes = {
  onAddNode: PropTypes.func,
  onSave: PropTypes.func,
  onExecute: PropTypes.func,
  onAutoLayout: PropTypes.func,
  onUndo: PropTypes.func,
  onRedo: PropTypes.func,
  onExport: PropTypes.func,
  onImport: PropTypes.func,
  isExecuting: PropTypes.bool,
  readOnly: PropTypes.bool,
  nodeCount: PropTypes.number,
  canUndo: PropTypes.bool,
  canRedo: PropTypes.bool,
};

export default WorkflowToolbar;
