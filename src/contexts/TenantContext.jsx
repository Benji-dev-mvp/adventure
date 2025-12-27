import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * TenantContext - Manages tenant/workspace/organization state
 * Used by Admin, Analytics, Campaign pages to scope data to current workspace
 */
const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const [tenantId, setTenantId] = useState(() => {
    // Load from localStorage on mount
    return localStorage.getItem('artisan_tenant_id') || null;
  });
  
  const [tenantName, setTenantName] = useState(() => {
    return localStorage.getItem('artisan_tenant_name') || 'My Organization';
  });

  useEffect(() => {
    // Persist tenant selection
    if (tenantId) {
      localStorage.setItem('artisan_tenant_id', tenantId);
    } else {
      localStorage.removeItem('artisan_tenant_id');
    }
  }, [tenantId]);

  useEffect(() => {
    // Persist tenant name
    if (tenantName) {
      localStorage.setItem('artisan_tenant_name', tenantName);
    }
  }, [tenantName]);

  const switchTenant = (id, name) => {
    setTenantId(id);
    if (name) {
      setTenantName(name);
    }
  };

  const clearTenant = () => {
    setTenantId(null);
    setTenantName('My Organization');
    localStorage.removeItem('artisan_tenant_id');
    localStorage.removeItem('artisan_tenant_name');
  };

  const value = {
    tenantId,
    tenantName,
    setTenantId,
    setTenantName,
    switchTenant,
    clearTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
