import { useContext, useState } from 'react';
import { SocketContext } from '../context/SocketContext';
import MapView from '../components/map/MapView';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { currentUser, setCurrentUser } = useContext(SocketContext);
  const [location, setLocation] = useState(currentUser?.location || null);

  const handleSave = async () => {
    try {
      const res = await axios.put(
        `/api/user/${currentUser._id}`,
        { location },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setCurrentUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

      <p><strong>Name:</strong> {currentUser?.name}</p>
      <p><strong>Email:</strong> {currentUser?.email}</p>

      <div className="my-4">
        <MapView location={location} onLocationChange={setLocation} />
      </div>

      <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
        Save Location
      </button>
    </div>
  );
};

export default Profile;