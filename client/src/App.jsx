import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Statistics from './pages/Statistics'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="relative min-h-full flex flex-col bg-gray-50">
          <Navbar />
          
          <main className="flex-1 flex items-start justify-center px-6 py-8 sm:px-8 lg:px-10 bg-white">
            <div className="w-full max-w-6xl">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white shadow-sm rounded-2xl"
                    >
                      <Dashboard />
                    </motion.div>
                  } />
                  <Route path="/transactions" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white shadow-sm rounded-2xl"
                    >
                      <Transactions />
                    </motion.div>
                  } />
                  <Route path="/statistics" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white shadow-sm rounded-2xl"
                    >
                      <Statistics />
                    </motion.div>
                  } />
                  <Route path="/settings" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white shadow-sm rounded-2xl"
                    >
                      <Settings />
                    </motion.div>
                  } />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
