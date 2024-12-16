import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300
      ${isActive 
        ? 'text-blue-600 bg-gradient-to-r from-blue-500/10 via-blue-400/20 to-blue-300/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]' 
        : 'text-gray-600 hover:text-gray-900'}
      group hover:bg-white/40`
    }
  >
    {({ isActive }) => (
      <>
        <span className="relative z-10">{children}</span>
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="navbar-active"
              className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/80 via-blue-100/30 to-white/40 -z-0 shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </AnimatePresence>
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 transition-opacity"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </>
    )}
  </NavLink>
);

const MobileNavItem = ({ to, children, icon, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block w-full transition-all duration-300`
    }
  >
    {({ isActive }) => (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative overflow-hidden p-3 rounded-xl flex items-center
          ${isActive 
            ? 'bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-300/20 shadow-lg' 
            : 'bg-white/40 hover:bg-white/50 shadow-md'}
        `}
      >
        <div className={`
          w-9 h-9 flex items-center justify-center rounded-lg mr-3
          ${isActive 
            ? 'bg-blue-500/20 text-blue-600' 
            : 'bg-gray-500/10 text-gray-600'}
        `}>
          {icon}
        </div>
        <span className={`
          text-base font-medium flex-1
          ${isActive ? 'text-blue-600' : 'text-gray-700'}
        `}>
          {children}
        </span>
        <motion.div
          animate={{ x: isActive ? 0 : 5, opacity: isActive ? 1 : 0.5 }}
          className="text-blue-500"
        >
          <svg 
            viewBox="0 0 20 20" 
            fill="currentColor"
            className="w-5 h-5"
          >
            <path 
              fillRule="evenodd" 
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </motion.div>
      </motion.div>
    )}
  </NavLink>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-4 z-50">
      <div className="mx-4 sm:mx-6 lg:mx-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glassmorphic shadow-lg rounded-2xl backdrop-blur-xl"
        >
          <div className="px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between">
              <NavLink to="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
                    Cuan Check
                  </span>
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600/0 via-blue-500/50 to-blue-400/0"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </NavLink>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <NavItem to="/">Transaksi</NavItem>
                <NavItem to="/statistik">Statistik</NavItem>
                <NavItem to="/pengaturan">Pengaturan</NavItem>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`
                  md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300
                  ${isOpen 
                    ? 'bg-blue-500/10 text-blue-600' 
                    : 'hover:bg-white/60 text-gray-600'}
                `}
                aria-label="Menu"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d={isOpen 
                      ? "M6 18L18 6M6 6l12 12" 
                      : "M4 6h16M4 12h16M4 18h16"
                    } 
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: "auto", 
                  opacity: 1,
                  transition: {
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2, delay: 0.1 }
                  }
                }}
                exit={{ 
                  height: 0, 
                  opacity: 0,
                  transition: {
                    height: { duration: 0.3 },
                    opacity: { duration: 0.2 }
                  }
                }}
                className="md:hidden overflow-hidden border-t border-blue-100/20"
              >
                <div className="p-3 grid gap-2">
                  <MobileNavItem 
                    to="/" 
                    onClick={() => setIsOpen(false)}
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    }
                  >
                    Transaksi
                  </MobileNavItem>
                  <MobileNavItem 
                    to="/statistik" 
                    onClick={() => setIsOpen(false)}
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    }
                  >
                    Statistik
                  </MobileNavItem>
                  <MobileNavItem 
                    to="/pengaturan" 
                    onClick={() => setIsOpen(false)}
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    }
                  >
                    Pengaturan
                  </MobileNavItem>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
