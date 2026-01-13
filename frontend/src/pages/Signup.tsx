import React from 'react';
import { SignupForm } from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 flex items-center">
      <SignupForm />
    </div>
  );
};

export default Signup;
