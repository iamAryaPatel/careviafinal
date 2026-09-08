import { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [toast, setToast] = useState('');
  const nav = useNavigate();
  const {
    user,
    profile,
    isProfileComplete,
    formatAuthError,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    resetPasswordForEmail,
  } = useAuth();

  useEffect(() => {
    if (user) {
      if (isProfileComplete(profile)) {
        nav('/dashboard', { replace: true });
      } else {
        nav('/complete-profile', { replace: true });
      }
    }
  }, [user, profile, isProfileComplete, nav]);

  const validateInputs = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return false;
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password.');
        return false;
      }
    }

    if (mode === 'signin' && (!password || password.length < 6)) {
      setError('Please enter your password (minimum 6 characters).');
      return false;
    }

    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMsg('');
    setToast('');

    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithPassword(email, password);
        setToast('Welcome back to your Carvia workspace');
        setTimeout(() => {
          if (isProfileComplete(profile)) {
            nav('/dashboard');
          } else {
            nav('/complete-profile');
          }
        }, 400);
      } else if (mode === 'signup') {
        const data = await signUpWithPassword(email, password, {
          data: { full_name: fullName.trim() },
        });
        if (data?.user && !data?.session) {
          const msg = 'Account created! Please check your email inbox to verify your account before logging in.';
          setInfoMsg(msg);
          setToast('Verification email sent');
        } else {
          setToast("Account created! Let's complete your profile.");
          setTimeout(() => nav('/complete-profile'), 400);
        }
      } else if (mode === 'forgot') {
        await resetPasswordForEmail(email);
        const msg = 'Password reset email sent! Check your inbox for the reset link.';
        setInfoMsg(msg);
        setToast(msg);
      }
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      setToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setInfoMsg('');
      setGoogleLoading(true);
      await signInWithGoogle();
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      setToast(msg);
      setGoogleLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-pitch">
        <div className="wordmark"><b>cv</b> Carvia</div>
        <div>
          <div className="eyebrow"><i /> Your career, organized</div>
          <h1>Make the next move<br /><em>with clarity.</em></h1>
          <p>Save roles, build your profile, and keep every opportunity in one calm workspace.</p>
        </div>
        <div className="auth-proof"><b>12,842</b><span>active roles<br />across 14 sources</span></div>
      </section>
      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={submit}>
          {mode !== 'forgot' && (
            <div className="auth-switch">
              <button
                type="button"
                className={mode === 'signin' ? 'active' : ''}
                onClick={() => { setMode('signin'); setError(''); setInfoMsg(''); }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => { setMode('signup'); setError(''); setInfoMsg(''); }}
              >
                Create account
              </button>
            </div>
          )}

          <h2>
            {mode === 'signin'
              ? 'Welcome back.'
              : mode === 'signup'
              ? 'Create your space.'
              : 'Reset password'}
          </h2>
          <p>
            {mode === 'signin'
              ? 'Sign in to continue your job search.'
              : mode === 'signup'
              ? 'Start comparing better opportunities today.'
              : 'Enter your account email to receive a password reset link.'}
          </p>

          {error && (
            <div style={{
              color: 'var(--danger, #f87171)',
              background: 'var(--danger-transparent, rgba(248, 113, 113, 0.12))',
              padding: '10px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.875rem',
              border: '1px solid var(--danger, #f87171)'
            }}>
              {error}
            </div>
          )}

          {infoMsg && (
            <div style={{
              color: 'var(--success, #34d399)',
              background: 'var(--success-transparent, rgba(52, 211, 153, 0.12))',
              padding: '10px 14px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.875rem',
              border: '1px solid var(--success, #34d399)'
            }}>
              {infoMsg}
            </div>
          )}

          {mode === 'signup' && (
            <label>
              Full name
              <input
                required
                placeholder="e.g. Alex Johnson"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
          )}

          <label>
            Email address
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {mode !== 'forgot' && (
            <label>
              Password
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          )}

          {mode === 'signup' && (
            <label>
              Confirm password
              <input
                required
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          )}

          <button className="primary-button full" disabled={loading} style={{ marginTop: '12px' }}>
            {loading
              ? 'Processing…'
              : mode === 'signin'
              ? 'Sign in →'
              : mode === 'signup'
              ? 'Create account →'
              : 'Send reset link →'}
          </button>

          {mode !== 'forgot' && (
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>{googleLoading ? 'Redirecting to Google…' : 'Continue with Google'}</span>
            </button>
          )}

          {mode === 'signin' && (
            <button
              type="button"
              className="forgot"
              onClick={() => { setMode('forgot'); setError(''); setInfoMsg(''); }}
            >
              Forgot password?
            </button>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              className="forgot"
              onClick={() => { setMode('signin'); setError(''); setInfoMsg(''); }}
              style={{ marginTop: '12px' }}
            >
              ← Back to Sign in
            </button>
          )}

          <small style={{ marginTop: '16px', display: 'block' }}>By continuing, you agree to the Terms and Privacy Policy.</small>
        </form>
      </section>
      <Toast message={toast} />
    </main>
  );
}


