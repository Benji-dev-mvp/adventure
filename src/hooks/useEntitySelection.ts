/**
 * Entity Selection Hooks
 * 
 * Helper hooks for managing entity selection across pages
 */

import { useCallback } from 'react';
import { useAppStore, type SelectedEntity } from '@/state/appStore';

/**
 * Hook for managing entity selection
 * Returns helpers to select and clear entities
 */
export function useEntitySelection() {
  const setSelectedEntity = useAppStore((state) => state.setSelectedEntity);
  const clearSelection = useAppStore((state) => state.clearSelectedEntity);
  const selectedEntity = useAppStore((state) => state.selectedEntity);

  const selectEntity = useCallback(
    (entity: SelectedEntity) => {
      setSelectedEntity(entity);
    },
    [setSelectedEntity]
  );

  const selectLead = useCallback(
    (id: string, name: string, metadata?: Record<string, any>) => {
      setSelectedEntity({
        type: 'lead',
        id,
        name,
        metadata,
      });
    },
    [setSelectedEntity]
  );

  const selectAccount = useCallback(
    (id: string, name: string, metadata?: Record<string, any>) => {
      setSelectedEntity({
        type: 'account',
        id,
        name,
        metadata,
      });
    },
    [setSelectedEntity]
  );

  const selectCampaign = useCallback(
    (id: string, name: string, metadata?: Record<string, any>) => {
      setSelectedEntity({
        type: 'campaign',
        id,
        name,
        metadata,
      });
    },
    [setSelectedEntity]
  );

  const selectPlaybook = useCallback(
    (id: string, name: string, metadata?: Record<string, any>) => {
      setSelectedEntity({
        type: 'playbook',
        id,
        name,
        metadata,
      });
    },
    [setSelectedEntity]
  );

  return {
    selectEntity,
    selectLead,
    selectAccount,
    selectCampaign,
    selectPlaybook,
    clearSelection,
    selectedEntity,
  };
}
