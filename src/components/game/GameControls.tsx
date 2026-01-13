import React from 'react';
import { Button } from '@/components/ui/button';
import { GameState, GameMode } from '@/types/game';
import { Play, Pause, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  onDirectionChange: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
}

export function GameControls({
  gameState,
  onStart,
  onPause,
  onResume,
  onReset,
  onModeChange,
  onDirectionChange,
}: GameControlsProps) {
  const { status, score, mode } = gameState;

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="text-center">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider mb-1">Score</p>
        <p className="font-pixel text-3xl text-primary text-glow">{score.toString().padStart(6, '0')}</p>
      </div>

      {/* Mode Selection */}
      <div className="space-y-2">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider text-center">Mode</p>
        <div className="flex gap-2">
          <Button
            variant={mode === 'walls' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('walls')}
            disabled={status === 'playing'}
            className="flex-1 text-xs"
          >
            Walls
          </Button>
          <Button
            variant={mode === 'passthrough' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('passthrough')}
            disabled={status === 'playing'}
            className="flex-1 text-xs"
          >
            Pass-Through
          </Button>
        </div>
      </div>

      {/* Game Controls */}
      <div className="space-y-2">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider text-center">Controls</p>
        <div className="flex justify-center gap-2">
          {status === 'idle' && (
            <Button onClick={onStart} variant="neon" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Start
            </Button>
          )}
          {status === 'playing' && (
            <Button onClick={onPause} variant="pink" size="lg">
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          {status === 'paused' && (
            <Button onClick={onResume} variant="neon" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Resume
            </Button>
          )}
          {status === 'gameover' && (
            <Button onClick={onReset} variant="default" size="lg">
              <RotateCcw className="mr-2 h-5 w-5" />
              Play Again
            </Button>
          )}
        </div>
        {(status === 'playing' || status === 'paused') && (
          <div className="flex justify-center mt-2">
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Direction Controls */}
      <div className="space-y-2 md:hidden">
        <p className="font-mono text-sm text-muted-foreground uppercase tracking-wider text-center">Direction</p>
        <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto">
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('UP')}
            disabled={status !== 'playing'}
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('LEFT')}
            disabled={status !== 'playing'}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('RIGHT')}
            disabled={status !== 'playing'}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onDirectionChange('DOWN')}
            disabled={status !== 'playing'}
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
          <div />
        </div>
      </div>

      {/* Keyboard Instructions */}
      <div className="hidden md:block text-center space-y-1">
        <p className="font-mono text-xs text-muted-foreground">
          Arrow keys or WASD to move
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          SPACE to pause/resume
        </p>
      </div>
    </div>
  );
}
