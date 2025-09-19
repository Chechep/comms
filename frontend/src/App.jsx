import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./components/Services";
import Solutions from "./pages/Solutions";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Analytics from "./pages/Analytics";
import Contacts from "./pages/Contacts";
import Templates from "./pages/Templates";
import Messaging from "./pages/Messaging";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

import ThemeProvider from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div
          className="flex flex-col min-h-screen"
          style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
        >
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Dashboard (Private) */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              >
                <Route path="contacts" element={<Contacts />} />
                <Route path="templates" element={<Templates />} />
                <Route path="messaging" element={<Messaging />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
