import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GroceriesContextProvider } from './context/GroceryContext';
import { AuthContextProvider } from './context/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <GroceriesContextProvider>
        <App />
      </GroceriesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
