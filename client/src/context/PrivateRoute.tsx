import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, ...rest }: any) => {
  const { token } = useAuth();

  // Return a Route component with the element prop, or redirect to login if no token
  return token ? element : <Navigate to="/" />;
};

export default PrivateRoute;
