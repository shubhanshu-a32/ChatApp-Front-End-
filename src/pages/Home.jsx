import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to ChatApp+</h1>
      <p className="mb-6 text-gray-600">Connect in real-time. Chat. Share. Locate.</p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;