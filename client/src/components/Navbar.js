import { Menu, LogOut, User, Home, BookOpen, Users } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Home', icon: <Home size={16} /> },
    { to: '/projects', label: 'Projects', icon: <BookOpen size={16} /> },
    { to: '/colleges', label: 'Colleges', icon: <Users size={16} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/2 backdrop-blur-md shadow-lg supports-[backdrop-filter]:bg-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center">P</span>
            <span className="hidden sm:inline">Prodiny</span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated && navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Button
                  as={Link}
                  key={link.to}
                  to={link.to}
                  variant="outline"
                  className={`flex items-center gap-1 px-3 py-2 transition-colors bg-transparent border-white/10 ${
                    isActive 
                      ? 'text-white bg-white/20 border-white/30' 
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Button>
              );
            })}
          </div>
          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button as={Link} to="/profile" variant="outline" className="flex items-center gap-2 px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-white/10">
                  <User size={16} />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
                <Button onClick={handleLogout} variant="outline" className="flex items-center gap-1 px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-white/10">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline" 
                  className={`px-4 py-2 transition-colors bg-transparent border-white/10 ${
                    location.pathname === '/login' 
                      ? 'text-white bg-white/20 border-white/30' 
                      : 'text-gray-200 hover:text-white'
                  }`}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="primary" 
                  className={`px-4 py-2 text-white rounded-full transition-colors ${
                    location.pathname === '/signup' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
          {/* Mobile menu button */}
          <Button variant="outline" className="md:hidden p-2 text-white bg-transparent border-white/10" onClick={() => setMobileOpen((v) => !v)}>
            <Menu size={24} />
          </Button>
        </div>
        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-lg bg-white/20 backdrop-blur p-4 shadow-lg border border-white/10 flex flex-col gap-2 animate-fade-in">
            {isAuthenticated && navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Button
                  as={Link}
                  key={link.to}
                  to={link.to}
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-2 transition-colors bg-transparent border-white/10 ${
                    isActive 
                      ? 'text-white bg-white/20 border-white/30' 
                      : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Button>
              );
            })}
            <div className="border-t border-white/10 my-2" />
            {isAuthenticated ? (
              <>
                <Button as={Link} to="/profile" variant="outline" className="flex items-center gap-2 px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 transition-colors bg-transparent border-white/10" onClick={() => setMobileOpen(false)}>
                  <User size={16} />
                  <span>{user?.name}</span>
                </Button>
                <Button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-2 text-gray-200 hover:text-white hover:bg-white/10 transition-colors w-full text-left bg-transparent border-white/10"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline" 
                  className={`px-4 py-2 transition-colors bg-transparent border-white/10 ${
                    location.pathname === '/login' 
                      ? 'text-white bg-white/20 border-white/30' 
                      : 'text-gray-200 hover:text-white'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="primary" 
                  className={`px-4 py-2 text-white rounded-full transition-colors ${
                    location.pathname === '/signup' 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-black hover:bg-gray-800'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
