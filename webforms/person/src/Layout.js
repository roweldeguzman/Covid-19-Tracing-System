import React, { useState, useEffect } from 'react';
import axios from "axios";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from "react-router-dom";
import Auth from '@aws-amplify/auth';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@material-ui/core';

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    overflow: "hidden",
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  withLink: {
    "& a": {
      textDecoration: "none",
      color: "rgb(158, 160, 165)",
      
      "&:hover": {
        color: "#3f51b5"
      }
    }
  },
  btnLogOut: {
    position: "absolute",
    bottom: 25,
    width: "90%",
    left: "5%",
    background: "rgb(240, 78, 55)",
    color: "#FFF",
    borderRadius: 3,
    "&:hover": {
      background: "rgb(240, 78, 55)",
      color: "#FFF"
    },
    "& a": {
      color: "#FFF",
      textDecoration: "none",
      "& svg": {
        verticalAlign: "bottom"
      }
    }
  },
  menu: {
    width: drawerWidth,
    textAlign: "center",
    position: "absolute",
    fontSize: 20
  }
}));

function Layout(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(window.innerWidth > 768 ? true : false);

  const { children, history } = props;
  
  useEffect(() => {
    try {
      const jwtToken = JSON.parse(localStorage.getItem("token")).signInUserSession.idToken.jwtToken;

      axios.defaults.headers.common = {
        "Authorization": jwtToken,
        'Content-Type': 'application/json',
      };
    } catch{
      localStorage.removeItem("token")
    }

    refreshToken();

    setInterval(() => {
      refreshToken()
    }, 3480000);
    
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const refreshToken = async () => {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    Auth.currentSession(JSON.parse(localStorage.getItem("token")))
      .then((response) => {
        axios.defaults.headers.common = {
          Authorization: response.idToken.jwtToken,
        };

      })
      .catch((error) => {
          console.log(error);
      });
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: window.innerWidth > 768 && open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            COVID-19 CONTACT TRACING SERVICE
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        variant={window.innerWidth > 768 ? "permanent" : "temporary"}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className={classes.toolbar}>
          <div className={classes.menu}>Menu</div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
          
        </div>
        <Divider />
        <List className={classes.withLink}>

          <Link to="/contacts" onClick={() => setOpen(false)}>
            <ListItem button selected={history.location.pathname.startsWith("/contacts")}>
              <ListItemIcon>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Contacts" />
            </ListItem>
          </Link>

          <Link to="/profile" onClick={() => setOpen(false)}>
            <ListItem button selected={history.location.pathname.startsWith("/profile")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </Link>
          
        </List>
        <Divider />

        <Button className={classes.btnLogOut} onClick={() => localStorage.removeItem("token")}>
          <Link to="/">
            { !open ? <ExitToAppIcon /> : "Logout"}
          </Link>
        </Button>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        
        {children}

      </main>
    </div>
  );
}
Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
}


export default Layout;

