import './index.css';
import { render } from "react-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { App } from "./App";
import { AppProvider } from "./context/AppContext";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Publishable Key");
}

render(
  <ClerkProvider 
    publishableKey={publishableKey}
    afterSignOutUrl="/"
  >
    <AppProvider>
      <App />
    </AppProvider>
  </ClerkProvider>, 
  document.getElementById("root")
);