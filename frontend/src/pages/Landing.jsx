import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          My Library
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 text-white bg-blue-600 hover:bg-white border hover:text-blue-600 hover:border-blue-600 rounded-lg font-medium transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-medium transition duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
