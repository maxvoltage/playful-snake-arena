import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border-2 border-border rounded-lg p-8 crt-curve">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl text-primary text-glow mb-2">LOG IN</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Enter the arcade
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/20 border border-destructive rounded-sm p-3">
              <p className="font-mono text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            New player?{' '}
            <Link to="/signup" className="text-neon-cyan hover:underline text-glow-cyan">
              Create account
            </Link>
          </p>
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-sm border border-border">
          <p className="font-mono text-xs text-muted-foreground text-center mb-2">Demo credentials:</p>
          <p className="font-mono text-xs text-foreground text-center">
            player1 / password123
          </p>
        </div>
      </div>
    </div>
  );
}
