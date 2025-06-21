import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';


const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.reload();
};

const Layout = ({ children }) => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const logoLink = isLoggedIn ? '/chat' : '/';
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-800 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-zinc-900 shadow mb-4">
        <Link to={logoLink} className="text-xl font-bold hover:text-blue-600 transition-colors">ChatApp+</Link>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </header>
      <main className="container mx-auto px-4 py-6">
        {children}
        {Login}
        {Register}
      </main>
      <footer className="text-center py-4 text-sm text-gray-600 mt-10 border-t">
        © {new Date().getFullYear()} ChatApp+. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;