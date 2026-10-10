require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const About = require('../models/About');
const SocialLink = require('../models/SocialLink');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Project = require('../models/Project');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      About.deleteMany(),
      SocialLink.deleteMany(),
      Skill.deleteMany(),
      Experience.deleteMany(),
      Project.deleteMany(),
    ]);

    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    const about = await About.create({
      name: 'Bikram Nahak',
      bio: 'Passionate full-stack developer with expertise in building modern web applications. I love turning complex problems into simple, beautiful, and intuitive solutions.',
      professionalTitle: 'Full Stack Developer',
      location: 'India',
      email: 'bikram@example.com',
      phone: '+91 9876543210',
      yearsExperience: 3,
      projectsCompleted: 15,
      technologiesCount: 20,
      passion: 'Building scalable web applications and exploring new technologies',
      currentRole: 'Full Stack Developer',
      animatedTitles: [
        'Full Stack Developer',
        'React Enthusiast',
        'Node.js Developer',
        'Problem Solver',
      ],
    });

    const social = await SocialLink.create({
      github: 'https://github.com/bikramnahak',
      linkedin: 'https://linkedin.com/in/bikramnahak',
      instagram: 'https://instagram.com/bikramnahak',
      facebook: 'https://facebook.com/bikramnahak',
      twitter: 'https://twitter.com/bikramnahak',
      email: 'bikram@example.com',
    });

    const skills = await Skill.insertMany([
      { name: 'React', category: 'Frontend', icon: 'react', displayOrder: 1 },
      { name: 'JavaScript', category: 'Frontend', icon: 'javascript', displayOrder: 2 },
      { name: 'TypeScript', category: 'Frontend', icon: 'typescript', displayOrder: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwind', displayOrder: 4 },
      { name: 'Node.js', category: 'Backend', icon: 'nodejs', displayOrder: 5 },
      { name: 'Express', category: 'Backend', icon: 'express', displayOrder: 6 },
      { name: 'MongoDB', category: 'Database', icon: 'mongodb', displayOrder: 7 },
      { name: 'PostgreSQL', category: 'Database', icon: 'postgresql', displayOrder: 8 },
      { name: 'Git', category: 'Tools', icon: 'git', displayOrder: 9 },
      { name: 'Docker', category: 'Tools', icon: 'docker', displayOrder: 10 },
    ]);

    const experiences = await Experience.insertMany([
      {
        company: 'Tech Solutions Inc.',
        position: 'Full Stack Developer',
        startDate: new Date('2022-01-01'),
        endDate: null,
        description:
          'Developed and maintained full-stack web applications using React, Node.js, and MongoDB. Led a team of 3 developers on key client projects.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
      },
      {
        company: 'Digital Agency',
        position: 'Frontend Developer',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
        description:
          'Built responsive user interfaces and implemented modern frontend architectures for various client websites.',
        technologies: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
      },
    ]);

    const projects = await Project.insertMany([
      {
        title: 'Portfolio Website',
        description: 'A modern MERN stack portfolio website with admin dashboard.',
        detailedDescription:
          'Full-featured portfolio website with dynamic content management, contact form, visitor tracking, and admin panel for managing projects, skills, and experiences.',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
        githubUrl: 'https://github.com/bikramnahak/portfolio',
        liveUrl: 'https://bikramnahak.dev',
        features: [
          'Admin dashboard',
          'Dynamic content management',
          'Contact form with message management',
          'Visitor analytics',
          'Resume download',
        ],
        challenges: 'Implementing real-time updates and secure admin authentication.',
        solutions: 'Used JWT authentication and RESTful API architecture with MongoDB.',
        featured: true,
      },
      {
        title: 'E-Commerce Platform',
        description: 'Full-featured online shopping platform with payment integration.',
        detailedDescription:
          'Complete e-commerce solution with product catalog, shopping cart, user authentication, and Stripe payment integration.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
        githubUrl: 'https://github.com/bikramnahak/ecommerce',
        liveUrl: 'https://shop.example.com',
        features: ['Product catalog', 'Shopping cart', 'Payment integration', 'Order tracking'],
        challenges: 'Handling concurrent orders and inventory management.',
        solutions: 'Implemented optimistic locking and real-time inventory updates.',
        featured: true,
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates.',
        detailedDescription:
          'Team collaboration tool featuring task boards, real-time notifications, and project tracking capabilities.',
        technologies: ['React', 'Socket.io', 'Node.js', 'PostgreSQL'],
        githubUrl: 'https://github.com/bikramnahak/taskmanager',
        liveUrl: 'https://tasks.example.com',
        features: ['Kanban boards', 'Real-time updates', 'Team collaboration', 'Due date reminders'],
        challenges: 'Synchronizing state across multiple clients in real-time.',
        solutions: 'Used Socket.io with event-driven architecture for live updates.',
        featured: false,
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Admin user: admin@portfolio.com / Admin@123`);
    console.log(`Created: ${skills.length} skills, ${experiences.length} experiences, ${projects.length} projects`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
