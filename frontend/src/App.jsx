import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

import { Provider } from 'react-redux'
import store, { persistor } from './services/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>

              <AppRoutes />

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    backdropFilter: 'blur(12px)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#8b5cf6',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

            </PersistGate>
          </Provider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}