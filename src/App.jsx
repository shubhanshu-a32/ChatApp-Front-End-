import { AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Layout from '../layout/Layout';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { useContext, useEffect } from 'react';
import { SocketContext } from './context/SocketContext';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, loading } = useContext(SocketContext);

  useEffect(() => {
    if (!loading && currentUser && location.pathname === '/') {
      navigate('/chat', { replace: true });
    }
  }, [loading, currentUser, location.pathname, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading...</div>;
  }

  return (
    <>
      {/* Layout wraps header/footer/navigation */}
      <Layout>
        {/* Animate page transitions */}
        <AnimatePresence mode="wait">
          <AppRoutes key={location.pathname} />
        </AnimatePresence>
      </Layout>

      {/* Toasts */}
      <Toaster position="top-right" reverseOrder={false} />
      <ToastContainer position="bottom-left" autoClose={3000} />
    </>
  );
};

export default App;