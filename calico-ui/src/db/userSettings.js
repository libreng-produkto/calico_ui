const SETTINGS_KEY = 'calico_user_settings';

const DEFAULT_SETTINGS = {
  darkMode: false,
  mealTimes: {
    breakfast: { start: 6, end: 10 },
    snacksMorning: { start: 10, end: 12 },
    lunch: { start: 12, end: 14 },
    snacksAfternoon: { start: 14, end: 18 },
    dinner: { start: 18, end: 22 },
    snacksNight: { start: 22, end: 30 },
  },
};

export function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      mealTimes: {
        ...DEFAULT_SETTINGS.mealTimes,
        ...(parsed.mealTimes || {}),
      },
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function updateSetting(key, value) {
  const settings = getSettings();
  settings[key] = value;
  saveSettings(settings);
  return settings;
}

export function updateMealTime(mealKey, start, end) {
  const settings = getSettings();
  settings.mealTimes[mealKey] = { start, end };
  saveSettings(settings);
  return settings;
}

export function getMealCategory(isoString) {
  const settings = getSettings();
  const date = new Date(isoString);
  const hour = date.getHours() + date.getMinutes() / 60;

  const { mealTimes } = settings;
  const adjustedHour = hour < 6 ? hour + 24 : hour;

  if (adjustedHour >= mealTimes.breakfast.start && adjustedHour < mealTimes.breakfast.end) return 'breakfast';
  if (adjustedHour >= mealTimes.snacksMorning.start && adjustedHour < mealTimes.snacksMorning.end) return 'snacks';
  if (adjustedHour >= mealTimes.lunch.start && adjustedHour < mealTimes.lunch.end) return 'lunch';
  if (adjustedHour >= mealTimes.snacksAfternoon.start && adjustedHour < mealTimes.snacksAfternoon.end) return 'snacks';
  if (adjustedHour >= mealTimes.dinner.start && adjustedHour < mealTimes.dinner.end) return 'dinner';
  return 'snacks';
}

export function cleanupOldEntries() {
  const STORAGE_KEY = 'calico_food_logs';
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    const logs = JSON.parse(data);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const cutoffKey = oneWeekAgo.toISOString().split('T')[0];

    let changed = false;
    for (const dateKey of Object.keys(logs)) {
      if (dateKey < cutoffKey) {
        delete logs[dateKey];
        changed = true;
      } else {
        const before = logs[dateKey].length;
        logs[dateKey] = logs[dateKey].filter((item) => {
          if (!item.loggedAt) return true;
          return new Date(item.loggedAt) >= oneWeekAgo;
        });
        if (logs[dateKey].length === 0) {
          delete logs[dateKey];
          changed = true;
        } else if (logs[dateKey].length !== before) {
          changed = true;
        }
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }
  } catch {
    // silent fail
  }
}
