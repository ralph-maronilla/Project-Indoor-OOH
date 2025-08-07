import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createCustomTheme from './theme';
import Sidebar from './components/navigation/Sidebar';
import { Box } from '@mui/material';
import { useAuthStore } from './store/authStore';
import { useAppStateStore } from "./stores/appState";
import { useApiStore } from "./stores/apiStore";

function App() {
  const [mode, setMode] = useState('dark'); // Manage light/dark mode state
  const theme = createCustomTheme(mode); // Dynamically create theme based on mode
  const { isAuthenticated } = useAuthStore();
   const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  const { portalCheckAuthUrl, portalUrl, authUser, setAuthUser } =
    useAppStateStore((state) => {
      return {
        portalCheckAuthUrl: state.portalCheckAuthUrl,
        portalUrl: state.portalUrl,
        authUser: state.authUser,
        setAuthUser: state.setAuthUser,
      };
    });


  // useEffect(() => {
  //   console.log('is authenticated: ', isAuthenticated);
  // }, [isAuthenticated]);


  useEffect(() => {
    const checkToken = async () => {
      // Function to get token from URL fragment
      const getTokenFromFragment = () => {
        const hash = window.location.hash; // e.g., #access_token=your_token_here
        const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
        return params.get("access_token");
      };

      // Retrieve token from URL fragment if it exists
      const tokenFromUrl = getTokenFromFragment();

      if (tokenFromUrl) {
        // Save token to localStorage
        localStorage.setItem("authToken", tokenFromUrl);

        // Redirect to remove token from URL fragment
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }

      // Retrieve token from localStorage
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          setIsLoading(true);
          // Call the portal API to validate the token
          const response = await fetch(`${portalCheckAuthUrl}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          const data = await response.json();
          if (data.success) {
            // Store user info in the authUser store
            setAuthUser(data.user); // Assuming `data.user` contains the authenticated user details
            console.log("User successfully authenticated:", data.user);
          } else {
            localStorage.removeItem("authToken");
            window.location.href = portalUrl;
          }
        } catch (error) {
          // Handle error (e.g., network issues)
          console.error("Token validation error:", error);
          localStorage.removeItem("authToken");
          window.location.href = portalUrl; // Redirect to external URL
        } finally {
          setIsLoading(false);
        }
      } else {
        // No token found, redirect to external URL
        window.location.href = portalUrl;
      }
      console.log("Global Token Successful");
      setIsTokenChecked(true);
    };

    checkToken();
  }, [portalCheckAuthUrl, portalUrl, setAuthUser]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Adds consistent global styles */}
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Sidebar mode={mode} setMode={setMode} />

        {/* Main content */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: 'auto',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
