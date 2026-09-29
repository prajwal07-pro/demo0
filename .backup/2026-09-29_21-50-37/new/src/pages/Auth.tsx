import * as React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Chrome,
  Github,
  Shield,
  Waves,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OrcaLogo } from '@/components/navigation/Navbar';
import { EASINGS } from '@/lib/animations';
import { useAppStore } from '@/store/useAppStore';

type Mode = 'signin' | 'signup' | 'forgot';

export default function Auth() {
  const [mode, setMode] = React.useState<Mode>('signin');
  const navigate = useNavigate();
  const showToast = useAppStore((s) => s.showToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend auth is not wired in this build. Surface an honest message.
    showToast(
      'Authentication backend is not connected in this build.',
      'info'
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-pearl text-ink">
      {/* Left: Form */}
      <div className="relative flex flex-col justify-center px-6 lg:px-16 py-12">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />

        <div className="relative w-full max-w-sm mx-auto">
          <Link to="/" className="inline-block mb-10">
            <OrcaLogo light />
          </Link>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASINGS.cinematic }}
          >
            <h1 className="font-display text-3xl font-bold text-ink tracking-tight">
              {mode === 'signin' && 'Welcome back.'}
              {mode === 'signup' && 'Create your account.'}
              {mode === 'forgot' && 'Reset your password.'}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              {mode === 'signin' &&
                'Sign in to access the ORCA intelligence platform.'}
              {mode === 'signup' &&
                'Join a community of researchers and operators.'}
              {mode === 'forgot' &&
                'Enter your email and we will send a reset link.'}
            </p>

            {mode !== 'forgot' && (
              <div className="mt-8 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="secondary-light"
                  leftIcon={<Chrome className="h-4 w-4" />}
                  onClick={() =>
                    showToast('OAuth requires a backend in this build.', 'info')
                  }
                >
                  Google
                </Button>
                <Button
                  type="button"
                  variant="secondary-light"
                  leftIcon={<Github className="h-4 w-4" />}
                  onClick={() =>
                    showToast('OAuth requires a backend in this build.', 'info')
                  }
                >
                  GitHub
                </Button>
              </div>
            )}

            {mode !== 'forgot' && (
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/10" />
                <span className="font-mono text-[10px] tracking-widest text-mist-deep">
                  OR
                </span>
                <span className="h-px flex-1 bg-ink/10" />
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <Input
                  variant="light"
                  label="FULL NAME"
                  type="text"
                  placeholder="Dr. Ada Mehta"
                  autoComplete="name"
                  required
                />
              )}

              <Input
                variant="light"
                label="EMAIL"
                type="email"
                placeholder="you@orca.marine"
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              {mode !== 'forgot' && (
                <Input
                  variant="light"
                  label="PASSWORD"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />
              )}

              {mode === 'signin' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-ink-soft">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-ink/20 bg-white accent-ocean"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-ocean hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="mt-2"
              >
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-ink-soft">
              {mode === 'signin' && (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-ocean hover:underline"
                  >
                    Create one
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-ocean hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <button
                  onClick={() => setMode('signin')}
                  className="text-ocean hover:underline"
                >
                  ← Back to sign in
                </button>
              )}
            </div>

            <div className="mt-10 flex items-center gap-2 text-[10px] font-mono tracking-wider text-mist-deep">
              <Shield className="h-3 w-3 text-ocean/60" />
              <span>SECURED BY ORCA · END-TO-END ENCRYPTED</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Cinematic panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-abyss">
        <div className="absolute inset-0 bg-gradient-to-br from-ocean/40 via-midnight to-abyss" />
        <div className="absolute inset-0 data-grid opacity-30" />

        <svg
          viewBox="0 0 400 400"
          className="absolute right-[-100px] bottom-[-100px] w-[500px] h-[500px] text-cyan/10"
        >
          <path
            d="M50 220c20-70 70-110 150-110s130 40 150 110c-25 15-50 25-75 25-15 35-40 50-75 50s-60-15-75-50c-25 0-50-10-75-25z"
            fill="currentColor"
          />
        </svg>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2 text-cyan/70">
            <Waves className="h-4 w-4" />
            <span className="font-mono text-[10px] tracking-[0.3em]">
              ORCA · MARINE INTELLIGENCE
            </span>
          </div>

          <div className="max-w-md">
            <p className="text-3xl font-display font-semibold text-white leading-tight">
              A smarter ocean
              <br />
              for a safer tomorrow.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {[
                'Real-time satellite & AIS fusion',
                'Ten-agent AI reasoning layer',
                'Cinematic 3D exploration lab',
                'Trusted by researchers & operators',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-white/90">
                  <CheckCircle2 className="h-4 w-4 text-cyan shrink-0 mt-0.5" />
                  <span className="text-sm">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-cyan/60 font-mono text-[10px] tracking-widest">
            <span className="h-1 w-1 rounded-full bg-teal animate-pulse" />
            <span>ENCRYPTED · AUDITABLE · TRUSTWORTHY</span>
          </div>
        </div>
      </div>
    </div>
  );
}