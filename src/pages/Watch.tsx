import React from 'react';
import { LiveGamesList } from '@/components/spectate/LiveGamesList';

const Watch = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <LiveGamesList />
    </div>
  );
};

export default Watch;
