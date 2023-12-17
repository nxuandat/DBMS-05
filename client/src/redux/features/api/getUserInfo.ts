import axios from 'axios';
import  store  from '../../store';
import { setUser, userLoggedOut } from '../auth/userSlice';

export async function getUserInfo() {
  try {
    const response = await axios.get(`${import.meta.env.VITE_REACT_SERVER_PORT}/api/v1/user/me`);

    if (response.data.success) {
      // Nếu thành công, gán user vào state
      store.dispatch(setUser({ user: response.data.user }));
    } else {
      // Nếu không thành công, đặt user và token thành ""
      store.dispatch(userLoggedOut());
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}