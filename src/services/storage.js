const STORAGE_KEY = "promises";

export const StorageService = {
  isAvailable: () => {
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      return true;
    } catch (e) {
      return false;
    }
  },

  savePromises: (promises) => {
    try {
      if (StorageService.isAvailable()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(promises));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving promises:", error);
      return false;
    }
  },

  loadPromises: () => {
    try {
      if (StorageService.isAvailable()) {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      }
      return [];
    } catch (error) {
      console.error("Error loading promises:", error);
      return [];
    }
  },

  clearPromises: () => {
    try {
      if (StorageService.isAvailable()) {
        localStorage.removeItem(STORAGE_KEY);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error clearing promises:", error);
      return false;
    }
  },
};
