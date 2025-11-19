import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'

import { UserProvider } from './context/ActiveUserContext.tsx';
import { ActionFeedbackToastsProvider } from './context/ActionFeedbackToastsContext.tsx';
import { GlobalModalDialogsStatesProvider } from './context/GlobalModalDialogsStatesContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>

      <ActionFeedbackToastsProvider>
      <UserProvider>
      <GlobalModalDialogsStatesProvider>
        <App />
      </GlobalModalDialogsStatesProvider>
      </UserProvider>
      </ActionFeedbackToastsProvider>

    </BrowserRouter>
  </StrictMode>,
)
