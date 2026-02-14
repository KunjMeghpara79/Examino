import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2Callback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const email = searchParams.get('email'); // Optional, if backend sends it
        const error = searchParams.get('error');

        if (token) {
            localStorage.setItem('token', token);
            if (email) localStorage.setItem('email', email);
            if (name) localStorage.setItem('name', name);
            // Optionally store email or fetch user details here
            // localStorage.setItem('user', JSON.stringify({ email })); 

            navigate('/dashboard'); // Or wherever you want to redirect
        } else if (error) {
            console.error('Google Login failed: ' + error);
            navigate('/');
        } else {
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <span className="ml-3">Processing login...</span>
        </div>
    );
};

export default OAuth2Callback;
