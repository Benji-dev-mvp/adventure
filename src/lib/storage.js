const STORAGE_PREFIX = 'artisan_';

export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(STORAGE_PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Persist user preferences
export const saveUserPreferences = (preferences) => {
  storage.set('user_preferences', preferences);
};

export const getUserPreferences = () => {
  const defaultEmailNotifications = {
    campaignPerformanceReports: true,
    newLeads: true,
    meetingBookings: true,
    replies: false,
    aiInsights: false,
  };

  const saved = storage.get('user_preferences', {});

  return {
    theme: 'light',
    dashboardLayout: 'default',
    emailNotifications: defaultEmailNotifications,
    // Merge saved values, ensuring new keys get sensible defaults
    ...saved,
    emailNotifications: {
      ...defaultEmailNotifications,
      ...(saved?.emailNotifications || {}),
    },
  };
};

// Persist draft campaigns
// Campaign drafts are keyed by campaignId. For backward compatibility, if only data
// is provided we fall back to a "default" draft so existing callers continue to work.
export const saveCampaignDraft = (campaignId, data) => {
  const drafts = storage.get('campaign_drafts', {}) || {};
  // Support legacy signature saveCampaignDraft(data)
  const id = typeof campaignId === 'string' ? campaignId : 'default';
  const payload = typeof campaignId === 'string' ? data : campaignId;
  drafts[id] = { ...(payload || {}), lastSaved: new Date().toISOString() };
  storage.set('campaign_drafts', drafts);
};

export const getCampaignDraft = (campaignId = 'default') => {
  const drafts = storage.get('campaign_drafts', {}) || {};
  return drafts[campaignId] || null;
};

export const deleteCampaignDraft = (campaignId = 'default') => {
  const drafts = storage.get('campaign_drafts', {}) || {};
  delete drafts[campaignId];
  storage.set('campaign_drafts', drafts);
};
