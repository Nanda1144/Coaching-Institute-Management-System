import api from '../api';

interface SettingsMap {
  institute: Record<string, unknown>;
  academic: Record<string, unknown>;
  security: Record<string, unknown>;
  notifications: Record<string, unknown>;
  appearance: Record<string, unknown>;
  backup: Record<string, unknown>;
}

const DEFAULT_VALUES: SettingsMap = {
  institute: { name: 'EduManage College', address: '123 Education Lane', phone: '+1 234 567 8900', email: 'admin@edumanage.edu', logo: '' },
  academic: { academicYear: '2026-2027', term: 'Fall Semester', startDate: '2026-08-01', endDate: '2026-12-20' },
  security: { passwordPolicy: 'Minimum 8 characters, 1 uppercase, 1 number', sessionTimeout: 60, twoFactor: false },
  notifications: { emailNotifications: true, smsNotifications: false, pushNotifications: true },
  appearance: { theme: 'Light', primaryColor: 'Blue' },
  backup: { autoBackup: true, backupFrequency: 'Daily', lastBackup: '2026-07-19 03:00 AM' },
};

function getLocalSettings() {
  try {
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged: Record<string, Record<string, unknown>> = {};
      for (const key of Object.keys(DEFAULT_VALUES)) {
        merged[key] = { ...(DEFAULT_VALUES as any)[key], ...(parsed[key] || {}) };
      }
      return { data: merged };
    }
  } catch { /* ignore */ }
  return { data: DEFAULT_VALUES as unknown as Record<string, Record<string, unknown>> };
}

function saveLocalSettings(section: string, values: Record<string, unknown>) {
  const current = getLocalSettings().data || {};
  current[section] = { ...(current[section] || {}), ...values };
  localStorage.setItem('app_settings', JSON.stringify(current));
  return { data: current[section] };
}

const settingsService = {
  async getSettings() {
    try {
      const { data } = await api.get('/settings');
      if (data?.data) {
        localStorage.setItem('app_settings', JSON.stringify(data.data));
      }
      return data;
    } catch {
      return getLocalSettings();
    }
  },

  async updateSettings(section: string, values: Record<string, unknown>) {
    try {
      const { data } = await api.patch(`/settings/${section}`, values);
      if (data?.data) {
        const current = getLocalSettings().data || {};
        current[section] = data.data;
        localStorage.setItem('app_settings', JSON.stringify(current));
      }
      return data;
    } catch {
      return saveLocalSettings(section, values);
    }
  },
};

export default settingsService;
