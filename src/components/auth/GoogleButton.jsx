import { GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {useAuth} from './useAuth';

const GoogleButton = () => {
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await googleLogin(credentialResponse.credential);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        toast.success('Logged in with Google');
        login;
        navigate('/chat');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="mt-4 text-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Google login failed')}
        useOneTap
        theme="filled_blue"
        shape="rectangular"
        text="continue_with"
        locale="en"
        width="100%"
        popup_type="popup"
        context="signin"
        ux_mode="popup"
      />
    </div>
  );
};

export default GoogleButton;