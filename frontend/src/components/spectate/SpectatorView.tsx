import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameBoard } from '@/components/game/GameBoard';
import { LiveGame, GameState, Direction } from '@/types/game';
import { api } from '@/api/api';
import { createInitialState, moveSnake, changeDirection, startGame } from '@/lib/gameLogic';
import { ArrowLeft, Users, Radio, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SpectatorView() {
  const { gameId } = useParams<{ gameId: string }>();
  const [liveGame, setLiveGame] = useState<LiveGame | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const gameLoopRef = useRef<number | null>(null);
  const directionChangeRef = useRef<number>(0);

  useEffect(() => {
    const fetchGame = async () => {
      if (!gameId) return;
      setIsLoading(true);

      const result = await api.liveGames.getGameById(gameId);
      if (result.success && result.data) {
        setLiveGame(result.data);
        // Initialize a simulated game state
        const initialState = createInitialState(result.data.mode, 20);
        setGameState(startGame({ ...initialState, score: result.data.score }));

        // Join as spectator
        await api.liveGames.joinSpectators(gameId);
      }
      setIsLoading(false);
    };

    fetchGame();

    return () => {
      if (gameId) {
        api.liveGames.leaveSpectators(gameId);
      }
    };
  }, [gameId]);

  // Simulate gameplay for spectating
  useEffect(() => {
    if (!gameState || gameState.status !== 'playing') return;

    gameLoopRef.current = window.setInterval(() => {
      // Randomly change direction occasionally to simulate player input
      directionChangeRef.current += 1;
      if (directionChangeRef.current % 3 === 0) {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        setGameState(prev => {
          if (!prev) return prev;
          const changed = changeDirection(prev, randomDirection);
          return moveSnake(changed);
        });
      } else {
        setGameState(prev => prev ? moveSnake(prev) : prev);
      }
    }, 150);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState?.status]);

  // Reset game when it's over (simulating continuous play)
  useEffect(() => {
    if (gameState?.status === 'gameover' && liveGame) {
      setTimeout(() => {
        const newState = createInitialState(liveGame.mode, 20);
        setGameState(startGame(newState));
      }, 2000);
    }
  }, [gameState?.status, liveGame]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!liveGame || !gameState) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-muted-foreground mb-4">Game not found</p>
        <Link to="/watch">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Live Games
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/watch">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Live Games
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-8">
        {/* Game Board */}
        <div className="relative">
          <div className="absolute -top-3 left-4 flex items-center gap-2 bg-card px-3 py-1 rounded border border-border z-20">
            <Radio className="h-3 w-3 text-destructive animate-pulse" />
            <span className="font-mono text-xs text-destructive">LIVE</span>
          </div>
          <GameBoard gameState={gameState} className="w-full max-w-[500px] mx-auto" />
        </div>

        {/* Info Panel */}
        <div className="bg-card border-2 border-border rounded-lg p-6 h-fit">
          <div className="space-y-6">
            {/* Player Info */}
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Watching
              </p>
              <h2 className="font-pixel text-xl text-neon-cyan text-glow-cyan">
                {liveGame.username}
              </h2>
            </div>

            {/* Score */}
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Score
              </p>
              <p className="font-pixel text-3xl text-primary text-glow">
                {gameState.score.toString().padStart(6, '0')}
              </p>
            </div>

            {/* Mode */}
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Mode
              </p>
              <span className={cn(
                "font-mono text-sm px-3 py-1 rounded border inline-block",
                liveGame.mode === 'walls'
                  ? "border-neon-cyan text-neon-cyan"
                  : "border-neon-pink text-neon-pink"
              )}>
                {liveGame.mode === 'walls' ? 'WALLS' : 'PASS-THROUGH'}
              </span>
            </div>

            {/* Spectators */}
            <div className="text-center">
              <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Spectators
              </p>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="font-mono text-xl text-foreground">
                  {liveGame.spectators}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
