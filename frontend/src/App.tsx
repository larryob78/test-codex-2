import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardPage from './components/DashboardPage';
import PreviewShowcase from './components/PreviewShowcase';
import ProjectPage from './components/ProjectPage';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Suspense fallback={<div className="p-8">Loading storyboard tools…</div>}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/preview" element={<PreviewShowcase />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
