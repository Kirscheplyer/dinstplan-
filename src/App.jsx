
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Kalender from "./pages/Kalender";
import Urlaub from "./pages/Urlaub";
import Mitarbeiter from "./pages/Mitarbeiter";
import Admin from "./pages/Admin";
import Auswertung from "./pages/Auswertung";

const PUBLISHABLE_KEY = "pk_test_cmVndWxhci1tb2xsdXNrLTc1LmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <SignedIn>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/kalender" element={<Kalender />} />
            <Route path="/urlaub" element={<Urlaub />} />
            <Route path="/mitarbeiter" element={<Mitarbeiter />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auswertung" element={<Auswertung />} />
          </Routes>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
