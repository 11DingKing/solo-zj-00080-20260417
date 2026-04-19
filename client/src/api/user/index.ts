import axios from 'axios';
import { UsersList, GetUsersQuery } from '../../types';
import * as utils from '../../utils';

export const getUsers = async (query: GetUsersQuery = {}): Promise<UsersList> => {
  try {
    const token = utils.getLocalStorageToken();
    if (token) {
      utils.setAxiosAuthToken(token);
    }

    const params: Record<string, string | number> = {};
    if (query.page !== undefined) params.page = query.page;
    if (query.limit !== undefined) params.limit = query.limit;
    if (query.search) params.search = query.search;

    const res = await axios({
      method: 'GET',
      url: '/api/users',
      params,
      headers: token
        ? {
            Autorization: `Bearer ${token}`
          }
        : {}
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.message || 'Failed to fetch users');
  }
};
