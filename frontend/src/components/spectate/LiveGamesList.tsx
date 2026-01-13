import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LiveGame } from '@/types/game';
import { api } from '@/api/mockApi';
import { Eye, Users, Loader2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveGamesList() {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoading(true);
      const result = await api.liveGames.getLiveGames();
      if (result.success && result.data) {
        setGames(result.data);
      }
      setIsLoading(false);
    };
    fetchGames();

    // Simulate live updates
    const interval = setInterval(async () => {
      const result = await api.liveGames.getLiveGames();
      if (result.success && result.data) {
        // Simulate score changes
        const updatedGames = result.data.map(game => ({
          ...game,
          score: game.score + Math.floor(Math.random() * 20),
        }));
        setGames(updatedGames);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card border-2 border-border rounded-lg p-6 crt-curve">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Radio className="h-5 w-5 text-destructive animate-pulse" />
            <h1 className="font-pixel text-2xl text-neon-cyan text-glow-cyan">LIVE GAMES</h1>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            Watch players in real-time
          </p>
        </div>

        {/* Games List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {games.map((game) => (
              <div
                key={game.id}
                className="bg-muted/30 border border-border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-mono text-lg text-foreground">{game.username}</h3>
                    <p className={cn(
                      "font-mono text-xs px-2 py-0.5 rounded border inline-block mt-1",
                      game.mode === 'walls' 
                        ? "border-neon-cyan text-neon-cyan" 
                        : "border-neon-pink text-neon-pink"
                    )}>
                      {game.mode === 'walls' ? 'WALLS' : 'PASS-THROUGH'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-pixel text-xl text-primary text-glow">
                      {game.score}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground mt-1">
                      <Users className="h-3 w-3" />
                      <span className="font-mono text-xs">{game.spectators}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/watch/${game.id}`}>
                  <Button variant="neon" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Watch Game
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!isLoading && games.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono text-muted-foreground">No live games right now.</p>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              Be the first to start playing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
