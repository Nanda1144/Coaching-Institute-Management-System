import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BatchListPage from './pages/BatchListPage';
import AddBatchPage from './pages/AddBatchPage';
import initialBatches from './data/batches';
import './App.css';

const PAGES = {
  'batch-list': { component: BatchListPage, label: 'Batch List' },
  'add-batch': { component: AddBatchPage, label: 'Add Batch' },
};

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('batch-list');

  const [batches, setBatches] = useState(() => {
    try {
      const stored = sessionStorage.getItem('ciiims_batches');
      return stored ? JSON.parse(stored) : initialBatches;
    } catch {
      return initialBatches;
    }
  });

  useEffect(() => {
    sessionStorage.setItem('ciiims_batches', JSON.stringify(batches));
  }, [batches]);

  function handleNavigate(page) {
    if (PAGES[page]) {
      setActivePage(page);
    }
  }

  function handleBatchCreated(newBatch) {
    setBatches((prev) => {
      const updated = [...prev, newBatch];
      return updated;
    });
  }

  function renderPage() {
    const page = PAGES[activePage];
    if (!page) return <BatchListPage onNavigate={handleNavigate} />;

    if (activePage === 'add-batch') {
      return (
        <AddBatchPage
          onNavigate={handleNavigate}
          onBatchCreated={handleBatchCreated}
        />
      );
    }

    return <BatchListPage onNavigate={handleNavigate} />;
  }

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
        activePage={activePage}
        onNavigate={handleNavigate}
      />
      <div className="main-area">
        {renderPage()}
      </div>
    </div>
  );
}
