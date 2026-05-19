const STORAGE_KEY = 'calico_food_logs';

function getLogs() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

export function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

export function getDayLogs(dateKey) {
  const logs = getLogs();
  return logs[dateKey] || [];
}

export function getAllLogs() {
  return getLogs();
}

export function addFoodItems(dateKey, items) {
  const logs = getLogs();
  if (!logs[dateKey]) {
    logs[dateKey] = [];
  }
  const entries = items.map((item) => ({
    ...item,
    loggedAt: new Date().toISOString(),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  }));
  logs[dateKey].push(...entries);
  saveLogs(logs);
  return entries;
}

export function removeFoodItem(dateKey, itemId) {
  const logs = getLogs();
  if (logs[dateKey]) {
    logs[dateKey] = logs[dateKey].filter((item) => item.id !== itemId);
    saveLogs(logs);
  }
}

export function clearDayLogs(dateKey) {
  const logs = getLogs();
  delete logs[dateKey];
  saveLogs(logs);
}

export function getDailyTotals(dateKey) {
  const items = getDayLogs(dateKey);
  return items.reduce(
    (totals, item) => ({
      calories: totals.calories + (item.calories || 0),
      carbs: totals.carbs + (item.carbs || 0),
      protein: totals.protein + (item.protein || 0),
      fat: totals.fat + (item.fat || 0),
      fiber: totals.fiber + (item.fiber || 0),
      sugar: totals.sugar + (item.sugar || 0),
      cholesterol: totals.cholesterol + (item.cholesterol || 0),
      potassium: totals.potassium + (item.potassium || 0),
    }),
    { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, sugar: 0, cholesterol: 0, potassium: 0 }
  );
}
