import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { getDayLogs, addFoodItems, removeFoodItem, clearDayLogs, getTodayKey, getDailyTotals, getAllLogs } from '../db/foodDb';

const AppContext = createContext();

const initialState = {
  pendingFoodItems: [],
  dailyLog: [],
  dailyTotals: { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, sugar: 0, cholesterol: 0, potassium: 0 },
  isLoading: false,
  error: null,
  sidebarOpen: false,
  selectedDate: getTodayKey(),
  availableDates: [],
  initialized: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_PENDING_FOOD':
      return { ...state, pendingFoodItems: action.payload };
    case 'CLEAR_PENDING_FOOD':
      return { ...state, pendingFoodItems: [] };
    case 'REMOVE_PENDING_ITEM':
      return {
        ...state,
        pendingFoodItems: state.pendingFoodItems.filter((_, idx) => idx !== action.payload),
      };
    case 'UPDATE_PENDING_SERVING':
      return {
        ...state,
        pendingFoodItems: state.pendingFoodItems.map((item, idx) =>
          idx === action.payload.index
            ? {
                ...item,
                serving: action.payload.serving,
                calories: (item._baseCalories / item._baseServing) * action.payload.serving,
                carbs: (item._baseCarbs / item._baseServing) * action.payload.serving,
                protein: (item._baseProtein / item._baseServing) * action.payload.serving,
                fat: (item._baseFat / item._baseServing) * action.payload.serving,
                fiber: ((item._baseFiber || 0) / item._baseServing) * action.payload.serving,
                sugar: ((item._baseSugar || 0) / item._baseServing) * action.payload.serving,
                cholesterol: ((item._baseCholesterol || 0) / item._baseServing) * action.payload.serving,
                potassium: ((item._basePotassium || 0) / item._baseServing) * action.payload.serving,
              }
            : item
        ),
      };
    case 'SET_DAILY_LOG':
      return {
        ...state,
        dailyLog: action.payload.log,
        dailyTotals: action.payload.totals,
        selectedDate: action.payload.date,
      };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false };
    case 'SET_AVAILABLE_DATES':
      return { ...state, availableDates: action.payload };
    case 'SET_INITIALIZED':
      return { ...state, initialized: true };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadDailyLog = useCallback((dateKey = getTodayKey()) => {
    const logs = getDayLogs(dateKey);
    const totals = getDailyTotals(dateKey);
    dispatch({ type: 'SET_DAILY_LOG', payload: { log: logs, totals, date: dateKey } });
    const allLogs = getAllLogs();
    const dates = Object.keys(allLogs).sort().reverse();
    dispatch({ type: 'SET_AVAILABLE_DATES', payload: dates });
  }, []);

  useEffect(() => {
    loadDailyLog();
    dispatch({ type: 'SET_INITIALIZED' });
  }, [loadDailyLog]);

  const sendMessage = useCallback(async (message, imageFile = null) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const { sendChat } = await import('../api/calorieApi');
      const response = await sendChat(message, imageFile);

      let foodItems = [];
      if (Array.isArray(response)) {
        foodItems = response;
      } else if (response.food_items) {
        foodItems = response.food_items;
      } else if (response.items) {
        foodItems = response.items;
      }

      const itemsWithBase = foodItems.map((item) => ({
        ...item,
        _baseCalories: item.calories,
        _baseCarbs: item.carbs,
        _baseProtein: item.protein,
        _baseFat: item.fat,
        _baseServing: item.serving || 100,
        _baseFiber: item.fiber || 0,
        _baseSugar: item.sugar || 0,
        _baseCholesterol: item.cholesterol || 0,
        _basePotassium: item.potassium || 0,
      }));

      dispatch({ type: 'SET_PENDING_FOOD', payload: itemsWithBase });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateServing = useCallback((index, serving) => {
    dispatch({ type: 'UPDATE_PENDING_SERVING', payload: { index, serving } });
  }, []);

  const removePendingItem = useCallback((index) => {
    dispatch({ type: 'REMOVE_PENDING_ITEM', payload: index });
  }, []);

  const logFood = useCallback(() => {
    if (state.pendingFoodItems.length === 0) return;
    addFoodItems(getTodayKey(), state.pendingFoodItems);
    dispatch({ type: 'CLEAR_PENDING_FOOD' });
    loadDailyLog();
  }, [state.pendingFoodItems, loadDailyLog]);

  const deleteLogItem = useCallback((itemId, dateKey = getTodayKey()) => {
    removeFoodItem(dateKey, itemId);
    loadDailyLog(dateKey);
  }, [loadDailyLog]);

  const clearDay = useCallback((dateKey = getTodayKey()) => {
    clearDayLogs(dateKey);
    loadDailyLog(dateKey);
  }, [loadDailyLog]);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        sendMessage,
        updateServing,
        removePendingItem,
        logFood,
        loadDailyLog,
        deleteLogItem,
        clearDay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
