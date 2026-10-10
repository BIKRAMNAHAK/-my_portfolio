import api from './api_config';
import toast from 'react-hot-toast';

export const addMessageAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/messages', formData);
            const message = res.data.data;
            dispatch({ type: 'ADD_MESSAGE', payload: message });
            return res.data;
        } catch (error) {
            toast.error('Failed to add message');
            return false;
        }
    }
}

export const getMyMessages = () => {
    return async (dispatch) => {
        try {
            const res = await api.get('/messages');
            const messages = res.data.data;
            dispatch({ type: 'SET_MY_MESSAGES', payload: messages });
        } catch {
            toast.error('Failed to fetch messages');
        }
    }
}

export const updateMessageAsync = (id, formData) => {
    return async (dispatch) => {
        try {
            const res = await api.put(`/messages/${id}`, formData);
            const updated = res.data.data;
            dispatch({ type: 'UPDATE_MESSAGE', payload: updated });
            toast.success('Message updated successfully');
            return res.data;
        } catch (error) {
            toast.error('Failed to update message');
            return false;
        }
    }
}

export const deleteMessageAsync = (id) => {
    return async (dispatch) => {
        try {
            const res = await api.delete(`/messages/${id}`);
            dispatch({ type: 'DELETE_MESSAGE', payload: id });
            return res.data;
        } catch (error) {
            toast.error('Failed to delete message');
            return false;
        }
    }
}
