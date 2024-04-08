import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a theme object
const theme = createTheme();

// Use createRoot to render the application
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Wrap your App component with ThemeProvider */}
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
