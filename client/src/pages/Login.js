import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded mb-4 hover:bg-blue-700">
          <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.23l6.9-6.9C36.68 2.36 30.7 0 24 0 14.82 0 6.73 5.06 2.69 12.44l8.06 6.26C12.6 13.13 17.88 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.04h12.4c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.6C43.98 37.1 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.75 28.7c-1.1-3.3-1.1-6.8 0-10.1l-8.06-6.26C.98 16.1 0 20.2 0 24.5c0 4.3.98 8.4 2.69 12.16l8.06-6.26z"/><path fill="#EA4335" d="M24 48c6.7 0 12.68-2.36 17.14-6.44l-7.18-5.6c-2.02 1.36-4.6 2.14-7.96 2.14-6.12 0-11.4-3.63-13.25-8.7l-8.06 6.26C6.73 42.94 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign in with Google
        </button>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>
        <form>
          <input type="email" placeholder="Email" className="w-full mb-3 px-3 py-2 border rounded" />
          <input type="password" placeholder="Password" className="w-full mb-3 px-3 py-2 border rounded" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;