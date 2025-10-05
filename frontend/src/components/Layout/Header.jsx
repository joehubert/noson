import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Devices', path: '/devices' },
    { name: 'Services', path: '/services' }
  ];

  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold">
              Noson
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'border-white'
                    : 'border-transparent hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
