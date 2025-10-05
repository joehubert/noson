import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      console.error('OAuth error:', error);
      alert('Authentication failed. Please try again.');
      navigate('/');
      return;
    }

    if (token) {
      // Store JWT token
      localStorage.setItem('jwt_token', token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } else {
      // No token provided
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
}
