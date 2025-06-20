import {GoogleLogin} from '@react-oauth/google';
import {useAuth} from '../context/AuthContext';

const GoogleLoginButton = () => {
    const {handleGoogleSuccess, handleGoogleError} = useAuth();

    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
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
    );
};

export default GoogleLoginButton; 