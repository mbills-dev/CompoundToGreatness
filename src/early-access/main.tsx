import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import EarlyAccess from './EarlyAccess.tsx';
import './EarlyAccess.css';

// /early-access is its own entry (early-access/index.html): its own title and share metadata, and none of the main
// site's bundle beyond React.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EarlyAccess />
  </StrictMode>
);
