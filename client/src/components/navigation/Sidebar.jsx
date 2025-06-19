import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Switch,
  IconButton,
  Icon,
  useMediaQuery,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MmsIcon from '@mui/icons-material/Mms';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const drawerWidth = 240;

function Sidebar({ mode, setMode }) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const location = useLocation(); // Get the current path
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      {isSmallScreen && (
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={toggleDrawer}
          sx={{
            ml: 1,
            mt: 1,
            position: 'fixed',
            zIndex: 1300,
            color: theme.palette.text.primary,
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant='persistent'
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: 'center',
            padding: 2,
            marginLeft: { xs: '1rem', md: 0 },
          }}
        >
          Project Indoor OOH
        </Typography>
        <Toolbar />

        <Box
          sx={{
            overflow: 'auto',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Navigation List */}
          <List>
            <ListItem
              button
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                backgroundColor: isActive('/')
                  ? theme.palette.hover.primary
                  : 'inherit',
                '&:hover': {
                  backgroundColor: theme.palette.hover.primary,
                },
              }}
            >
              <ListItemIcon>
                <HomeIcon sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItem>

            <ListItem
              button
              onClick={() => navigate('/media')}
              sx={{
                cursor: 'pointer',
                backgroundColor: isActive('/media')
                  ? theme.palette.hover.primary
                  : 'inherit',
                '&:hover': {
                  backgroundColor: theme.palette.hover.primary,
                },
              }}
            >
              <ListItemIcon>
                <MmsIcon sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary='Media' />
            </ListItem>
          </List>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 2,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Typography variant='body2' sx={{ mr: 1 }}>
                Dark Mode
              </Typography>
              <Switch
                checked={mode === 'dark'}
                onChange={handleToggleMode}
                color='primary'
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default Sidebar;
