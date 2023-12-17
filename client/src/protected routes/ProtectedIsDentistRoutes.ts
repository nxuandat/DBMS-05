import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '../redux/rootReducer';
import { useEffect, ReactNode } from 'react';

interface ProtectedIsEmployeeRouteProps {
  children: ReactNode;
}

const ProtectedIsEmployeeRoute: React.FC<ProtectedIsEmployeeRouteProps> = ({ children }) => {
  const { user , token } = useSelector((state:RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token && !user.MaNS) {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate]);

  return children;
};

export default ProtectedIsEmployeeRoute;
