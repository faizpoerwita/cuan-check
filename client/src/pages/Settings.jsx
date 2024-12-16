import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import { CardBody, CardContainer, CardItem } from '../components/ui/3d-card'
import { BsSunFill, BsMoonFill } from 'react-icons/bs'

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pengaturan</h2>
      
      <CardContainer className="w-full">
        <CardBody className="!h-auto !w-full bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl p-6">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Tampilan
          </CardItem>
          
          <div className="mt-4">
            <CardItem
              as="div"
              translateZ="60"
              className="flex items-center justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Mode Gelap
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Mengubah tampilan aplikasi ke mode gelap
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`
                  relative inline-flex h-12 w-12 items-center justify-center rounded-lg
                  ${isDark 
                    ? 'bg-gray-900 text-yellow-300 hover:bg-gray-800' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                  transition-colors duration-200
                  border border-black/[0.1] dark:border-white/[0.2]
                  shadow-xl
                `}
              >
                {isDark ? (
                  <BsSunFill className="h-6 w-6" />
                ) : (
                  <BsMoonFill className="h-6 w-6" />
                )}
                <span className="sr-only">
                  {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
              </motion.button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  )
}

export default Settings
