import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '../redux/rootReducer';
import { useEffect, ReactNode } from 'react';

interface ProtectedIsDentistRouteProps {
  children: ReactNode;
}

const ProtectedIsDentistRoute: React.FC<ProtectedIsDentistRouteProps> = ({ children }) => {
  const { user , token } = useSelector((state:RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token && !user.MaNV) {
      navigate('/', { replace: true });
    }
  }, [user, token, navigate]);

  return children;
};

export default ProtectedIsDentistRoute;
