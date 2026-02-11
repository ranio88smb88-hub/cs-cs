
const STORAGE_KEY_PREFIX = 'cspro_';

export const sheetService = {
  saveData: (key: string, data: any) => {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  },
  
  getData: <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  },

  // Helper to simulate async sheet delay
  asyncDelay: () => new Promise(resolve => setTimeout(resolve, 300))
};
