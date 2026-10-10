import api from './api_config';
import toast from 'react-hot-toast';

export const addExperienceAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/experiences', formData);
            const experience = res.data.data;
            dispatch({ type: 'ADD_EXPERIENCE', payload: experience });
            return res.data;
        } catch (error) {
            toast.error('Failed to add experience');
            return false;
        }
    }
}

export const getMyExperiences = () => {
    return async (dispatch) => {
        try {
            const res = await api.get('/experiences');
            const experiences = res.data.data;
            dispatch({ type: 'SET_MY_EXPERIENCES', payload: experiences });
        } catch {
            toast.error('Failed to fetch experiences');
        }
    }
}

export const updateExperienceAsync = (id, formData) => {
    return async (dispatch) => {
        try {
            const res = await api.put(`/experiences/${id}`, formData);
            const updated = res.data.data;
            dispatch({ type: 'UPDATE_EXPERIENCE', payload: updated });
            toast.success('Experience updated successfully');
            return res.data;
        } catch (error) {
            toast.error('Failed to update experience');
            return false;
        }
    }
}

export const deleteExperienceAsync = (id) => {
    return async (dispatch) => {
        try {
            const res = await api.delete(`/experiences/${id}`);
            dispatch({ type: 'DELETE_EXPERIENCE', payload: id });
            return res.data;
        } catch (error) {
            toast.error('Failed to delete experience');
            return false;
        }
    }
}
