import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuthContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await signup(username, email, password);
    
    setIsLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border-2 border-border rounded-lg p-8 crt-curve">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-2xl text-neon-pink text-glow-pink mb-2">SIGN UP</h1>
          <p className="font-mono text-sm text-muted-foreground">
            Join the leaderboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
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
              placeholder="Create password"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-mono text-sm text-muted-foreground uppercase tracking-wider">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
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
            variant="secondary"
            className="w-full" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline text-glow">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
