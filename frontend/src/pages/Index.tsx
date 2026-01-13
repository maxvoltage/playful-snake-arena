import React from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { useGame } from '@/hooks/useGame';
import { useAuthContext } from '@/contexts/AuthContext';
import { api } from '@/api/mockApi';
import { useEffect } from 'react';

const Index = () => {
  const { gameState, start, pause, resume, reset, setMode, setDirection } = useGame('walls');
  const { isAuthenticated } = useAuthContext();

  // Submit score when game ends
  useEffect(() => {
    if (gameState.status === 'gameover' && gameState.score > 0 && isAuthenticated) {
      api.leaderboard.submitScore(gameState.score, gameState.mode);
    }
  }, [gameState.status, gameState.score, gameState.mode, isAuthenticated]);

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl md:text-4xl text-primary text-glow mb-2">
            SNAKE
          </h1>
          <p className="font-mono text-muted-foreground">
            Classic arcade game • {gameState.mode === 'walls' ? 'Walls Mode' : 'Pass-Through Mode'}
          </p>
        </div>

        {/* Game Layout */}
        <div className="grid lg:grid-cols-[1fr,280px] gap-8 items-start">
          {/* Game Board */}
          <GameBoard 
            gameState={gameState} 
            className="w-full max-w-[500px] mx-auto lg:mx-0" 
          />

          {/* Controls Panel */}
          <div className="bg-card border-2 border-border rounded-lg p-6 crt-curve">
            <GameControls
              gameState={gameState}
              onStart={start}
              onPause={pause}
              onResume={resume}
              onReset={reset}
              onModeChange={setMode}
              onDirectionChange={setDirection}
            />
          </div>
        </div>

        {/* Login prompt */}
        {!isAuthenticated && gameState.score > 0 && gameState.status === 'gameover' && (
          <div className="mt-6 text-center">
            <p className="font-mono text-sm text-muted-foreground">
              <a href="/login" className="text-neon-cyan hover:underline">Log in</a> or{' '}
              <a href="/signup" className="text-neon-pink hover:underline">sign up</a>{' '}
              to save your score to the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
