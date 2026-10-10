const fs = require('fs');
const path = require('path');

const models = [
  { name: 'Skill', plural: 'Skills', endpoint: 'skills', lowercase: 'skill', lowercasePlural: 'skills' },
  { name: 'Experience', plural: 'Experiences', endpoint: 'experiences', lowercase: 'experience', lowercasePlural: 'experiences' },
  { name: 'Message', plural: 'Messages', endpoint: 'messages', lowercase: 'message', lowercasePlural: 'messages' },
  { name: 'Resume', plural: 'Resumes', endpoint: 'resumes', lowercase: 'resume', lowercasePlural: 'resumes' }
];

const apisDir = path.join(__dirname, 'frontend/src/services/apis');
const reducersDir = path.join(__dirname, 'frontend/src/services/reducer');

if(!fs.existsSync(apisDir)) fs.mkdirSync(apisDir, {recursive: true});
if(!fs.existsSync(reducersDir)) fs.mkdirSync(reducersDir, {recursive: true});

models.forEach(model => {
  const managementCode = `import api from './api_config';
import toast from 'react-hot-toast';

export const add${model.name}Async = (formData) => {
    return async (dispatch) => {
        try {
            const res = await api.post('/${model.endpoint}', formData);
            const ${model.lowercase} = res.data.data;
            dispatch({ type: 'ADD_${model.name.toUpperCase()}', payload: ${model.lowercase} });
            return res.data;
        } catch (error) {
            toast.error('Failed to add ${model.lowercase}');
            return false;
        }
    }
}

export const getMy${model.plural} = () => {
    return async (dispatch) => {
        try {
            const res = await api.get('/${model.endpoint}');
            const ${model.lowercasePlural} = res.data.data;
            dispatch({ type: 'SET_MY_${model.plural.toUpperCase()}', payload: ${model.lowercasePlural} });
        } catch {
            toast.error('Failed to fetch ${model.lowercasePlural}');
        }
    }
}

export const update${model.name}Async = (id, formData) => {
    return async (dispatch) => {
        try {
            const res = await api.put(\`/${model.endpoint}/\${id}\`, formData);
            const updated = res.data.data;
            dispatch({ type: 'UPDATE_${model.name.toUpperCase()}', payload: updated });
            toast.success('${model.name} updated successfully');
            return res.data;
        } catch (error) {
            toast.error('Failed to update ${model.lowercase}');
            return false;
        }
    }
}

export const delete${model.name}Async = (id) => {
    return async (dispatch) => {
        try {
            const res = await api.delete(\`/${model.endpoint}/\${id}\`);
            dispatch({ type: 'DELETE_${model.name.toUpperCase()}', payload: id });
            return res.data;
        } catch (error) {
            toast.error('Failed to delete ${model.lowercase}');
            return false;
        }
    }
}
`;

  const reducerCode = `const initialState = {
    ${model.lowercasePlural}: [],
}

const ${model.lowercase}Reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MY_${model.plural.toUpperCase()}':
            return {
                ...state,
                ${model.lowercasePlural}: action.payload
            }
        default:
            return state
    }
}

export default ${model.lowercase}Reducer
`;

  fs.writeFileSync(path.join(apisDir, model.lowercasePlural + 'Management.js'), managementCode);
  fs.writeFileSync(path.join(reducersDir, model.lowercase + 'Reducer.js'), reducerCode);
});
