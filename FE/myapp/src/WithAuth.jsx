import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const withAuth = (Component) => {
    return () => {
        const [isLoading, setIsLoading] = useState(true);
        const navigate = useNavigate();
        const token = sessionStorage.getItem('token');

        useEffect(() => {
            if (!token) {
                sessionStorage.clear();
                sessionStorage.setItem('msg', 'Login again');
                navigate('/');
            } else {
                setIsLoading(false);
            }
        }, [token, navigate]);

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return <Component />;
    };
};

export default withAuth;