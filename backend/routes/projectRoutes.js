const express = require('express');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { uploadProjectImage } = require('../middleware/upload');

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);

// Support both / and /project routes
router.post('/', protect, uploadProjectImage, createProject);
router.post('/project', protect, uploadProjectImage, createProject);

router.put('/:id', protect, uploadProjectImage, updateProject);
router.put('/project/:id', protect, uploadProjectImage, updateProject);

router.delete('/:id', protect, deleteProject);
router.delete('/project/:id', protect, deleteProject);

module.exports = router;
