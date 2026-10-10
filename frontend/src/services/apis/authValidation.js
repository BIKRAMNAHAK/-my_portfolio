import api from './api_config'; // apna axios instance ka sahi path daalo
import toast from 'react-hot-toast';



export const checkAuthAsync = () => {
    
    return async (dispatch) => {
        const token = localStorage.getItem('token');
            console.log('Token from localStorage:', token); // Debugging line
        if (!token) {
            dispatch({ type: 'AUTH_CHECK_COMPLETE' });
            return;
        }

        try {
            const res = await api.get('/auth/me');
            const user = res.data.data;
            console.log('User data:', user); // Debugging line
            
            dispatch({ type: 'LOGIN_SUCCESS', payload: user, });
        } catch (error) {
            console.error( 'Auth check failed:',  error.response?.data || error.message );
            localStorage.removeItem('token');
            dispatch({  type: 'AUTH_CHECK_COMPLETE', });
        }
    };
};

export const userLoginAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/auth/login', formData);
            const { token, user } = res.data.data;
            console.log('Login response:', res.data.data);
            
            localStorage.setItem('token', token);

            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            // toast.success('Welcome back, Bikram!');

            return res.data; // success signal component ko
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message); // Debugging line

            const message = error.response?.data?.message || 'Email or password is incorrect.';
           dispatch({ type: 'LOGIN_FAILURE', payload: message });
            toast.error(message);

            return false; // failure signal component ko
        }
    }
}


