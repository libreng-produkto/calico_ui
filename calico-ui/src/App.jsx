import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import TopSection from './components/TopSection';
import FoodList from './components/FoodList';
import DayView from './components/DayView';
import Sidebar from './components/Sidebar';
import './index.css';

function AppContent() {
  const { state } = useApp();

  const hasPendingItems = state.pendingFoodItems.length > 0;
  const showDayView = !hasPendingItems && state.dailyLog.length > 0;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="fixed inset-x-0 top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
        <Header />
        <div className="pb-4">
          <TopSection />
        </div>
      </div>

      <div className="h-[18rem] shrink-0" />

      <main className="flex-1 overflow-y-auto">
        <div className="py-4 pb-8">
          {showDayView ? <DayView /> : <FoodList />}
        </div>
      </main>

      <Sidebar />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
