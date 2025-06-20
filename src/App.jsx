import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Layout from '../layout/Layout';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const location = useLocation();

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