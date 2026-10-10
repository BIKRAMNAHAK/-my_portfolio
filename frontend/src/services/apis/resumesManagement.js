import api from './api_config';
import toast from 'react-hot-toast';

export const addResumeAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/resumes', formData);
            const resume = res.data.data;
            dispatch({ type: 'ADD_RESUME', payload: resume });
            return res.data;
        } catch (error) {
            toast.error('Failed to add resume');
            return false;
        }
    }
}

export const getMyResumes = () => {
    return async (dispatch) => {
        try {
            const res = await api.get('/resumes');
            const resumes = res.data.data;
            dispatch({ type: 'SET_MY_RESUMES', payload: resumes });
        } catch {
            toast.error('Failed to fetch resumes');
        }
    }
}

export const updateResumeAsync = (id, formData) => {
    return async (dispatch) => {
        try {
            const res = await api.put(`/resumes/${id}`, formData);
            const updated = res.data.data;
            dispatch({ type: 'UPDATE_RESUME', payload: updated });
            toast.success('Resume updated successfully');
            return res.data;
        } catch (error) {
            toast.error('Failed to update resume');
            return false;
        }
    }
}

export const deleteResumeAsync = (id) => {
    return async (dispatch) => {
        try {
            const res = await api.delete(`/resumes/${id}`);
            dispatch({ type: 'DELETE_RESUME', payload: id });
            return res.data;
        } catch (error) {
            toast.error('Failed to delete resume');
            return false;
        }
    }
}
