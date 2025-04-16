'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react'; // Import signIn

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<'google' | 'github' | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // TODO: Implement actual login logic (e.g., using credentials provider if needed)
    console.log('Login attempt:', { email, password });

    setTimeout(() => {
      if (password !== 'password') {
        setError('잘못된 이메일 또는 비밀번호입니다.');
      } else {
        console.log('Login successful!');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsSocialLoading(provider);
    setError(null);
    try {
      // Call signIn with the provider
      await signIn(provider, { callbackUrl: '/' }); // Redirect to home page on success
      // signIn redirects, so the lines below might not be reached unless there is an error
    } catch (error: any) { // Catch potential errors during sign in initiation
      console.error("Social login initiation error:", error);
      // Check if error is specific type if needed, otherwise generic message
      if (error.message.includes('OAuthAccountNotLinked')) {
        setError('이미 다른 소셜 계정으로 가입된 이메일입니다.');
      } else {
        setError('소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      // Only set loading to false if there was an error *before* redirect
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            이메일 주소
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || !!isSocialLoading}
            className={cn(
              "mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm",
              "focus:border-primary focus:outline-none focus:ring-primary sm:text-sm",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || !!isSocialLoading}
            className={cn(
              "mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm",
              "focus:border-primary focus:outline-none focus:ring-primary sm:text-sm",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !!isSocialLoading}
          className={cn(
            "flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-2 text-muted">또는</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-4">
        {/* Google Login Button */}
        <button
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading || !!isSocialLoading}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {/* Placeholder for Google Icon */}
          <span className="text-lg">🇬</span>
          Google 계정으로 로그인
          {isSocialLoading === 'google' && <span className="ml-2"><Spinner /></span>}
        </button>

        {/* GitHub Login Button */}
        <button
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading || !!isSocialLoading}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm",
            "hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {/* Placeholder for GitHub Icon */}
          <span className="text-lg">👾</span>
          GitHub 계정으로 로그인
          {isSocialLoading === 'github' && <span className="ml-2"><Spinner /></span>}
        </button>
      </div>
    </div>
  );
}

// Optional: Simple Spinner component
function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
} 