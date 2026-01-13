import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuditPage from "./pages/AuditPage";
import ScanProgress from "./pages/ScanProgress";
import AuditReport from "./pages/AuditReport";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App min-h-screen bg-background noise-bg">
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/scanning" element={<ScanProgress />} />
          <Route path="/report/:auditId" element={<AuditReport />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
