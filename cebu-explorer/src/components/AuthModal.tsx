import React, { useState } from 'react';
import { Mail, Lock, User, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: any) => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLogin) {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError('Please provide your name.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: trimmedEmail, password } 
        : { name: name.trim(), email: trimmedEmail, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed. Please check credentials.');
      }

      // Successfully authenticated
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#141414]/30 p-4">
      <div className="bg-white max-w-[400px] w-full border border-[#141414] p-6 shadow-[6px_6px_0px_#141414] relative rounded-none">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 text-[#141414] hover:opacity-75 font-bold text-lg cursor-pointer"
        >
          &times;
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2 justify-center mb-4 pb-3 border-b border-[#141414]">
          <span className="font-mono bg-[#141414] text-white px-2 py-0.5 border border-[#141414] text-[10px] uppercase font-bold tracking-wider">
            Cebu Explorer Terminal
          </span>
        </div>

        <h2 className="text-center font-serif italic font-bold text-lg text-[#141414] mb-4">
          {isLogin ? 'Welcome Back / Sign In' : 'Create System Account'}
        </h2>

        {/* Error Alert bar */}
        {error && (
          <div className="flex items-start gap-2 bg-white border border-red-500 border-l-4 border-l-red-600 text-red-600 rounded-none p-3 text-xs mb-4 font-mono font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          
          {/* Full Name input for registration */}
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#141414] opacity-65">Full Name</label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#141414]" />
                <input 
                  type="text" 
                  placeholder="Juan dela Cruz" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-[#141414] rounded-none outline-none text-xs font-mono bg-white focus:ring-1 focus:ring-[#141414]"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Address input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#141414] opacity-65">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#141414]" />
              <input 
                type="email" 
                placeholder="juan@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-[#141414] rounded-none outline-none text-xs font-mono bg-white focus:ring-1 focus:ring-[#141414]"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#141414] opacity-65">Password</label>
            <div className="relative">
              <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#141414]" />
              <input 
                type="password" 
                placeholder={isLogin ? "Enter password" : "At least 8 characters"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-[#141414] rounded-none outline-none text-xs font-mono bg-white focus:ring-1 focus:ring-[#141414]"
                required
              />
            </div>
          </div>

          {/* Confirm password input for registration */}
          {!isLogin && (
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#141414] opacity-65">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#141414]" />
                <input 
                  type="password" 
                  placeholder="Repeat your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-[#141414] rounded-none outline-none text-xs font-mono bg-white focus:ring-1 focus:ring-[#141414]"
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 w-full bg-[#141414] text-white py-2.5 rounded-none font-bold text-xs uppercase tracking-wider border border-[#141414] hover:bg-white hover:text-[#141414] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="text-center text-[11px] font-mono text-[#141414] mt-5">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="ml-1.5 text-[#141414] font-bold underline cursor-pointer"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
