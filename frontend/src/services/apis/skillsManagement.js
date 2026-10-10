import api from './api_config';
import toast from 'react-hot-toast';

export const addSkillAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/skills', formData);
            const skill = res.data.data;
            dispatch({ type: 'ADD_SKILL', payload: skill });
            return res.data;
        } catch (error) {
            toast.error('Failed to add skill');
            return false;
        }
    }
}

export const getMySkills = () => {
    return async (dispatch) => {
        try {
            const res = await api.get('/skills');
            const skills = res.data.data;
            dispatch({ type: 'SET_MY_SKILLS', payload: skills });
        } catch {
            toast.error('Failed to fetch skills');
        }
    }
}

export const updateSkillAsync = (id, formData) => {
    return async (dispatch) => {
        try {
            const res = await api.put(`/skills/${id}`, formData);
            const updated = res.data.data;
            dispatch({ type: 'UPDATE_SKILL', payload: updated });
            toast.success('Skill updated successfully');
            return res.data;
        } catch (error) {
            toast.error('Failed to update skill');
            return false;
        }
    }
}

export const deleteSkillAsync = (id) => {
    return async (dispatch) => {
        try {
            const res = await api.delete(`/skills/${id}`);
            dispatch({ type: 'DELETE_SKILL', payload: id });
            return res.data;
        } catch (error) {
            toast.error('Failed to delete skill');
            return false;
        }
    }
}
