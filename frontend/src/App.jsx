import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import UploadStatement from "./pages/UploadStatement";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-statement"
          element={
            <ProtectedRoute>
              <UploadStatement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/how-it-works"
          element={
              <HowItWorks />
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
