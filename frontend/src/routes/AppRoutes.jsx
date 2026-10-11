
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../components/ui/Loader'

const HomePage = lazy(() => import('../pages/HomePage'))
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage'))
const LoginPage = lazy(() => import('../admin/pages/LoginPage'))
const DashboardPage = lazy(() => import('../admin/pages/DashboardPage'))
const ProjectsPage = lazy(() => import('../admin/pages/ProjectsPage'))
const SkillsPage = lazy(() => import('../admin/pages/SkillsPage'))
const ExperiencesPage = lazy(() => import('../admin/pages/ExperiencesPage'))
const EducationPage = lazy(() => import('../admin/pages/EducationPage'))
const AboutPage = lazy(() => import('../admin/pages/AboutPage'))
const SocialPage = lazy(() => import('../admin/pages/SocialPage'))
const MessagesPage = lazy(() => import('../admin/pages/MessagesPage'))
const ResumePage = lazy(() => import('../admin/pages/ResumePage'))
const AdminLayout = lazy(() => import('../admin/layouts/AdminLayout'))

function PageLoader() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '60vh' }}
    >
      <Loader />
    </div>
  )
}

function LoginRoute() {
  const { isAuthenticated } = useSelector((state) => state.my_data)
  const token = localStorage.getItem('token')

  if (token && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <LoginPage />
}

function AdminRoutes() {
  const { isAuthenticated } = useSelector((state) => state.my_data)
  const token = localStorage.getItem('token')

  if (!token || !isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <AdminLayout />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/admin/login" element={<LoginRoute />} />

        <Route path="/admin" element={<AdminRoutes />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

