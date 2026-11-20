import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Success from './Success.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import TermsConditions from './TermsConditions.tsx';
import Support from './Support.tsx';
import ResetPassword from './ResetPassword.tsx';
import { consumeRecoveryParamsFromURL } from './recoveryToken';
import { scrubAuthFragmentFromURL } from './authFragmentScrub';
import './index.css';

// Early bootstrap: if the user landed on /reset-password with a recovery token
// in the query string, strip it from the address bar before React or any
// third-party script can read window.location. The token is cached in module
// scope and consumed once by verifyOtp on the reset page.
if (typeof window !== 'undefined' && window.location.pathname === '/reset-password') {
  consumeRecoveryParamsFromURL();
}

// Then, on every path: drop any auth-token fragment (see authFragmentScrub.ts).
scrubAuthFragmentFromURL();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<Success />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/support" element={<Support />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
