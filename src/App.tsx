import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import EventDetailsPage from './pages/EventDetailsPage';
import TentSelectionPage from './pages/TentSelectionPage';
import ContactDetailsPage from './pages/ContactDetailsPage';
import ThankYouPage from './pages/ThankYouPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { ToastProvider } from './contexts/ToastContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a1a1a',
    },
    secondary: {
      main: '#9c8275',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <AuthProvider>
          <EventProvider>
            <ToastProvider>
              <BrowserRouter>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  minHeight: '100vh'
                }}>
                  <Header />
                  <Box sx={{ flex: 1 }}>
                    <Routes>
                      <Route path="/" element={<EventDetailsPage />} />
                      <Route path="/tent-selection" element={<TentSelectionPage />} />
                      <Route path="/contact-details" element={<ContactDetailsPage />} />
                      <Route path="/thank-you" element={<ThankYouPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Box>
                  <Footer />
                </Box>
              </BrowserRouter>
            </ToastProvider>
          </EventProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;