import api from './api_config'; // apna axios instance ka sahi path daalo
import toast from 'react-hot-toast';


export const addProjectAsync = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/projects/project', formData);
            console.log('Add project response:', res.data);

            const project = res.data.data;
            dispatch({ type: 'ADD_PROJECT', payload: project });
            return res.data;
        } catch (error) {
            console.log('Error adding project:', error);

            toast.error('Failed to add project');
            return false;
        }
    }
}


export const getMyprojects = () => {
    return async (dispatch) => {
        try {
            const res = await api.get('/projects');
            // console.log('Get my projects response:', res.data.data);
            const projects = res.data.data;
            dispatch({ type: 'SET_MY_PROJECTS', payload: projects });
        } catch {
            toast.error('Failed to fetch projects');
        }
    }
}

export const updateProjectAsync = (id, formData) => {
    return async (dispatch) => {
        try {
            const res = await api.put(`/projects/project/${id}`, formData);
            // console.log('Update project response:', res.data);
            const updatedProject = res.data.data;
            dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
            toast.success('Project updated successfully');
            return res.data;
        } catch (error) {
            // console.log('Error updating project:', error);
            toast.error('Failed to update project');
            return false;
        }
    }
}


export const deleteProjectAsync = (id) => {
    return async (dispatch) => {
        try {
            const res = await api.delete(`/projects/project/${id}`);
            // console.log('Delete project response:', res.data);
            dispatch({ type: 'DELETE_PROJECT', payload: id });
            // toast.success('Project deleted successfully');
            return res.data;
        } catch (error) {
            console.log('Error Delete project:', error);
            toast.error('Failed to Delete project');
            return false;
        }
    }
}

