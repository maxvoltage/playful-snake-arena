import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 flex items-center">
      <LoginForm />
    </div>
  );
};

export default Login;
