import { createTheme } from '@mui/material/styles'; // Import createTheme

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#fff',
        },
    },
});

export default theme;
