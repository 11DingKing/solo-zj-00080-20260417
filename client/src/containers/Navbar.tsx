import React from 'react';

import { Link } from 'react-router-dom';
import { Button, makeStyles, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';

import AuthLinks from '../components/auth-links/AuthLinks';
import { IStore } from '../types';

const useStyles = makeStyles((theme) => ({
  navbar: {
    height: '80px',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    background: 'white',
    boxShadow: '0 0 8px 3px rgba(0,0,0,0.2)',
    zIndex: 999,
    padding: '0 16px',
    [theme.breakpoints.down('md')]: {
      padding: '0 8px'
    }
  },
  navLinks: {
    '& > a': {
      margin: '0 0.3rem'
    }
  },
  authLinks: {
    '& > a': {
      textDecoration: 'none',
      color: 'black'
    }
  },
  navButton: {
    height: '48px',
    minWidth: '80px',
    textDecoration: 'none'
  }
}));

const Navbar = () => {
  const classes = useStyles();
  const { currentUser } = useSelector((state: IStore) => state.auth);

  return (
    <Grid
      container
      alignItems="center"
      justify="space-between"
      className={classes.navbar}
    >
      <Grid item className={classes.navLinks}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Link to="/">
              <Button
                className={classes.navButton}
                style={{
                  border: '2px black solid'
                }}
              >
                Home
              </Button>
            </Link>
          </Grid>
          {currentUser && (
            <>
              <Grid item>
                <Link to="/demo">
                  <Button
                    className={classes.navButton}
                    style={{
                      background: 'black',
                      color: 'white'
                    }}
                  >
                    Demo
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/users">
                  <Button
                    className={classes.navButton}
                    style={{
                      background: '#FF0083',
                      color: 'white'
                    }}
                  >
                    Users
                  </Button>
                </Link>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <Grid item className={classes.authLinks}>
        <AuthLinks />
      </Grid>
    </Grid>
  );
};

export default Navbar;
