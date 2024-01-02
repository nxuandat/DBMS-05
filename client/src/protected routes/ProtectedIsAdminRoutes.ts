import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '../redux/rootReducer';
import { useEffect, ReactNode } from 'react';

interface ProtectedIsAdminRouteProps {
  children: ReactNode;
}

const ProtectedIsAdminRoute: React.FC<ProtectedIsAdminRouteProps> = ({ children }) => {
  const { user , token } = useSelector((state:RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token && !user.MaQTV) {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate]);

  return children;
};

export default ProtectedIsAdminRoute;
