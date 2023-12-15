import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '../redux/rootReducer';
import { useEffect, ReactNode } from 'react';

interface ProtectedIsLoginRouteProps {
  children: ReactNode;
}

const ProtectedIsLoginRoute: React.FC<ProtectedIsLoginRouteProps> = ({ children }) => {
  const { user , token } = useSelector((state:RootState) => state.user);
  console.log(user,token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !token) {
      navigate('/login', { replace: true });
    }
  }, [user, token, navigate]);

  return children
};

export default ProtectedIsLoginRoute;