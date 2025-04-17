import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge
} from '@mui/material';
import {
  Dashboard,
  AccountCircle,
  AssignmentTurnedIn,
  AccountBalanceWallet
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isEmployer, pendingCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Base path is now simplified
  const basePath = isEmployer ? '/employer' : '/employee';

  const items = isEmployer
    ? [
        {
          text: 'Dashboard',
          icon: <Dashboard />,
          path: `${basePath}/dashboard`,
        },
        {
          text: 'Profile',
          icon: <AccountCircle />,
          path: `${basePath}/profile`,
        },
        {
          text: 'Requests',
          icon: (
            <Badge badgeContent={pendingCount} color="error">
              <AssignmentTurnedIn />
            </Badge>
          ),
          path: `${basePath}/requests`,
        },
      ]
    : [
        {
          text: 'Dashboard',
          icon: <Dashboard />,
          path: `${basePath}/dashboard`,
        },
        {
          text: 'Profile',
          icon: <AccountCircle />,
          path: `${basePath}/profile`,
        },
        {
          text: 'Requests',
          icon: <AssignmentTurnedIn />,
          path: `${basePath}/requests`,
        },
        {
          text: 'Wallet',
          icon: <AccountBalanceWallet />,
          path: `${basePath}/wallet`,
        },
      ];

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 240 }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Carbon Admin
        </Typography>
      </Toolbar>
      <List>
        {items.map(({ text, icon, path }) => (
          <ListItem
            button
            key={text}
            selected={location.pathname === path}
            onClick={() => navigate(path)}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
