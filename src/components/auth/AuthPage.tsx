import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { firebaseConfig } from '../../firebase/config.ts';
import {
  BookOpen,
  Eye,
  EyeOff,
  Sparkles,
  Languages,
  ShieldCheck,
  Volume2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Unauthorized domain guidance
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setUnauthorizedDomain(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        // User cancelled popup, do nothing
      } else if (err?.code === 'auth/unauthorized-domain' || err?.message?.includes('unauthorized-domain')) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        setUnauthorizedDomain(hostname || 'ais-dev-s4pe5ee4c7o6oh2typ4hpv-409021394881.asia-southeast1.run.app');
      } else if (err?.code === 'auth/network-request-failed') {
        setErrorMessage('Network connection error. Please check your internet connection.');
      } else {
        setErrorMessage(err?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please provide your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        await signUpWithEmail(cleanEmail, password, fullName);
      } else {
        await signInWithEmail(cleanEmail, password);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      let friendly = 'An error occurred during authentication. Please try again.';
      if (err?.code === 'auth/email-already-in-use') {
        friendly = 'This email is already registered. Please sign in instead.';
      } else if (err?.code === 'auth/operation-not-allowed') {
        friendly = 'Email/Password authentication needs to be enabled in your Firebase console under Authentication > Sign-in method.';
      } else if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        friendly = 'Invalid email or password. Please double-check your credentials.';
      } else if (err?.code === 'auth/weak-password') {
        friendly = 'Password is too weak. Please choose a stronger password.';
      } else if (err?.code === 'auth/too-many-requests') {
        friendly = 'Access temporarily disabled due to many failed attempts. Try again later or reset your password.';
      } else if (err?.message) {
        friendly = err.message;
      }
      setErrorMessage(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetMessage(null);

    const clean = resetEmail.trim();
    if (!clean) {
      setResetError('Please enter your registered email address.');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordReset(clean);
      setResetMessage('Password reset link sent! Check your email inbox to proceed.');
      setTimeout(() => {
        setShowForgotModal(false);
        setResetMessage(null);
      }, 4000);
    } catch (err: any) {
      if (err?.code === 'auth/user-not-found') {
        setResetError('No account found with this email address.');
      } else {
        setResetError(err?.message || 'Failed to send password reset email.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* LEFT SECTION - Brand & Visual Narrative */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Ambient gradient backdrops */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                LEXORA
              </span>
              <span className="block text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                Vocabulary Suite
              </span>
            </div>
          </div>
        </div>

        {/* Center narrative & word preview illustration */}
        <div className="relative z-10 my-4 lg:my-0 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-3 lg:mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Empower Your Linguistic Mastery
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-2 lg:mb-4">
            Your words. <br className="hidden sm:inline" />
            Your knowledge. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-300 bg-clip-text text-transparent">
              Your vocabulary.
            </span>
          </h1>
          <p className="text-slate-400 text-sm lg:text-base leading-relaxed mb-4 lg:mb-8 hidden sm:block">
            Curate, organize, and retain your personal collection of English words paired with authentic Tamil meanings.
            Stored securely on Cloud Firestore for seamless access everywhere.
          </p>

          {/* Interactive Vocabulary Card Mockup (desktop/tablet) */}
          <div className="hidden sm:block p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-wide">Serendipity</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  noun
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>/ser-uhn-dip-i-tee/</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The occurrence and development of events by chance in a happy or beneficial way.
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-tamil">
                <Languages className="w-3.5 h-3.5 text-indigo-400" />
                தமிழ் பொருள்
              </span>
              <span className="text-xs font-medium text-indigo-200 font-tamil">
                எதிர்பாராத அதிர்ஷ்ட நிகழ்வு
              </span>
            </div>
          </div>

          {/* Key highlights list (desktop) */}
          <div className="hidden lg:grid grid-cols-2 gap-3 mt-8 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Isolated Firestore Cloud Vault</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Bilingual Tamil & English</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              <span>Instant Substring Search</span>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pronunciation Audio Engine</span>
            </div>
          </div>
        </div>

        {/* Footer info (desktop) */}
        <div className="relative z-10 text-xs text-slate-500 hidden lg:flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} Lexora Systems</span>
          <span>Crafted for language enthusiasts</span>
        </div>
      </div>

      {/* RIGHT SECTION - Authentication Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
          {/* Header Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Start your vocabulary journey'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'signin'
                ? 'Sign in to access your personal vocabulary vault.'
                : 'Create your free account to curate your words with cloud sync.'}
            </p>
          </div>

          {/* Feedback messages */}
          {unauthorizedDomain && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs space-y-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Authorize Domain for Google Sign-In</h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    Firebase requires this app's domain to be added to <strong>Authorized Domains</strong> before Google Authentication can proceed.
                  </p>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                <code className="text-slate-800 font-mono text-[11px] select-all break-all">{unauthorizedDomain}</code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(unauthorizedDomain);
                    setCopiedDomain(true);
                    setTimeout(() => setCopiedDomain(false), 2000);
                  }}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                >
                  {copiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDomain ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <a
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  <span>Open Firebase Settings</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="text-[11px] text-slate-500">
                  Settings &rarr; Authorized domains &rarr; Add domain
                </span>
              </div>

              <div className="pt-2 border-t border-amber-200/80 text-[11px] text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Tip:</strong> You can also sign up or sign in immediately using <strong>Email & Password</strong> below!
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-200" />
            <span className="px-3 text-xs uppercase text-slate-400 font-semibold tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Maya Reynolds"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setShowForgotModal(true);
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Terms & Privacy links */}
          <p className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
            By continuing, you agree to Lexora's{' '}
            <span className="text-slate-600 hover:underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-slate-600 hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setResetError(null);
                setResetMessage(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900">Reset Your Password</h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Enter your registered email address and we'll send you a secure link to reset your password.
            </p>

            {resetError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {resetError}
              </div>
            )}
            {resetMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {resetLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
