import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  InputAdornment,
  Typography,
  makeStyles,
  Theme,
  CircularProgress
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { User, UsersList } from '../types';
import * as userAPI from '../api/user';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
    padding: theme.spacing(2)
  },
  title: {
    marginBottom: theme.spacing(3),
    fontSize: '2rem',
    fontWeight: 'bold'
  },
  searchField: {
    marginBottom: theme.spacing(3),
    width: '100%',
    maxWidth: '400px'
  },
  tableWrapper: {
    width: '100%',
    maxWidth: '1200px'
  },
  table: {
    minWidth: 650
  },
  tableHeader: {
    background: 'black',
    color: 'white'
  },
  tableHeaderCell: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 600
  },
  loadingWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4)
  },
  noData: {
    textAlign: 'center',
    padding: theme.spacing(4),
    fontSize: '1.2rem'
  }
}));

const columns = [
  { id: 'username', label: 'Username', minWidth: 200 },
  { id: 'email', label: 'Email', minWidth: 250 },
  { id: 'createdOn', label: 'Registration Time', minWidth: 200 }
];

const Users: React.FC = () => {
  const classes = useStyles();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await userAPI.getUsers({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm || undefined
      });
      setUsersList(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput);
      setPage(0);
    }
  };

  const handleSearchClick = () => {
    setSearchTerm(searchInput);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getUsername = (email: string): string => {
    return email.split('@')[0];
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.title}>User Management</Typography>
      
      <TextField
        className={classes.searchField}
        label="Search by Username"
        variant="outlined"
        value={searchInput}
        onChange={handleSearchChange}
        onKeyPress={handleSearchKeyPress}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ cursor: 'pointer' }} onClick={handleSearchClick} />
            </InputAdornment>
          )
        }}
        placeholder="Press Enter to search..."
      />

      <div className={classes.tableWrapper}>
        <TableContainer component={Paper} elevation={6}>
          {loading ? (
            <div className={classes.loadingWrapper}>
              <CircularProgress />
            </div>
          ) : error ? (
            <div className={classes.noData} style={{ color: 'red' }}>
              {error}
            </div>
          ) : (
            <>
              <Table className={classes.table} stickyHeader aria-label="users table">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="left"
                        style={{ minWidth: column.minWidth }}
                        className={classes.tableHeaderCell}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersList?.users && usersList.users.length > 0 ? (
                    usersList.users.map((user: User) => (
                      <TableRow hover tabIndex={-1} key={user.id}>
                        <TableCell>
                          {getUsername(user.email)}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{formatDate(user.createdOn)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className={classes.noData}>
                        {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={usersList?.total || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </TableContainer>
      </div>
    </div>
  );
};

export default Users;
