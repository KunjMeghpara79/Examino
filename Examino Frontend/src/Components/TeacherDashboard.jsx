import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-4 text-purple-500">Teacher Dashboard</h1>
            <p className="text-gray-300 mb-8">Welcome {localStorage.getItem('name')}! You are logged in as a Teacher.</p>
            <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition cursor-pointer"
            >
                Logout
            </button>
        </div>
    );
};

export default TeacherDashboard;
