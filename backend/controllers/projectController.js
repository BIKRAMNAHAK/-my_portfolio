const Project = require('../models/Project');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { getPublicPath, deleteFile } = require('../middleware/upload');

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json({ success: true, data: projects });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  
  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ success: true, data: project });
});

const createProject = asyncHandler(async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.technologies !== undefined) data.technologies = parseArrayField(data.technologies);
    if (data.features !== undefined) data.features = parseArrayField(data.features);
    if (data.featured !== undefined) data.featured = data.featured === true || data.featured === 'true';

    if (req.file) {
      data.image = getPublicPath('projects', req.file.filename);
    }

    const project = await Project.create(data);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Project could not be created',
    });
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');

  const data = { ...req.body };
  if (data.technologies !== undefined) data.technologies = parseArrayField(data.technologies);
  if (data.features !== undefined) data.features = parseArrayField(data.features);
  if (data.featured !== undefined) data.featured = data.featured === true || data.featured === 'true';

  if (req.file) {
    deleteFile(project.image);
    data.image = getPublicPath('projects', req.file.filename);
  }

  Object.assign(project, data);
  await project.save();

  res.json({ success: true, data: project });
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found');

  deleteFile(project.image);
  await project.deleteOne();

  res.json({ success: true, message: 'Project deleted successfully' });
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
