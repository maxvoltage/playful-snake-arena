import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LeaderboardEntry, GameMode } from '@/types/game';
import { api } from '@/api/api';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<GameMode | 'all'>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      const mode = selectedMode === 'all' ? undefined : selectedMode;
      const result = await api.leaderboard.getLeaderboard(mode);
      if (result.success && result.data) {
        setEntries(result.data);
      }
      setIsLoading(false);
    };
    fetchLeaderboard();
  }, [selectedMode]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-neon-yellow" />;
      case 2:
        return <Medal className="h-5 w-5 text-muted-foreground" />;
      case 3:
        return <Award className="h-5 w-5 text-neon-pink" />;
      default:
        return <span className="font-mono text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card border-2 border-border rounded-lg p-6 crt-curve">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-pixel text-2xl text-primary text-glow mb-2">LEADERBOARD</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Top players worldwide
          </p>
        </div>

        {/* Mode Filter */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={selectedMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMode('all')}
          >
            All
          </Button>
          <Button
            variant={selectedMode === 'walls' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMode('walls')}
          >
            Walls
          </Button>
          <Button
            variant={selectedMode === 'passthrough' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedMode('passthrough')}
          >
            Pass-Through
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="font-mono text-xs text-muted-foreground uppercase tracking-wider py-3 text-left w-16">
                    Rank
                  </th>
                  <th className="font-mono text-xs text-muted-foreground uppercase tracking-wider py-3 text-left">
                    Player
                  </th>
                  <th className="font-mono text-xs text-muted-foreground uppercase tracking-wider py-3 text-right">
                    Score
                  </th>
                  <th className="font-mono text-xs text-muted-foreground uppercase tracking-wider py-3 text-right hidden sm:table-cell">
                    Mode
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={cn(
                      "border-b border-border/50 transition-colors hover:bg-muted/30",
                      index < 3 && "bg-muted/20"
                    )}
                  >
                    <td className="py-4">
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={cn(
                        "font-mono",
                        index === 0 && "text-neon-yellow",
                        index === 1 && "text-foreground",
                        index === 2 && "text-neon-pink"
                      )}>
                        {entry.username}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-pixel text-primary text-glow">
                        {entry.score.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 text-right hidden sm:table-cell">
                      <span className={cn(
                        "font-mono text-xs px-2 py-1 rounded border",
                        entry.mode === 'walls'
                          ? "border-neon-cyan text-neon-cyan"
                          : "border-neon-pink text-neon-pink"
                      )}>
                        {entry.mode === 'walls' ? 'WALLS' : 'PASS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && entries.length === 0 && (
          <div className="text-center py-12">
            <p className="font-mono text-muted-foreground">No scores yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
