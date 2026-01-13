import React from 'react';
import { SpectatorView } from '@/components/spectate/SpectatorView';

const WatchGame = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <SpectatorView />
    </div>
  );
};

export default WatchGame;
