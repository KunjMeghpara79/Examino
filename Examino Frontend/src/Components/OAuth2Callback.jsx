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

        const role = searchParams.get('role');

        console.log('OAuth2 Callback Debug:');
        console.log('Full Query String:', location.search);
        console.log('Parsed Params:', {
            token: token ? 'present' : 'missing',
            name: name,
            email: email,
            role: role
        });

        if (token) {
            localStorage.setItem('token', token);
            if (email) localStorage.setItem('email', email);
            if (name) localStorage.setItem('name', name);
            if (role) localStorage.setItem('role', role);

            if (role === 'STUDENT') {
                navigate('/student-dashboard');
            } else if (role === 'TEACHER') {
                navigate('/teacher-dashboard');
            } else {
                // Fallback
                console.warn('Unknown role:', role);
                navigate('/');
            }
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
