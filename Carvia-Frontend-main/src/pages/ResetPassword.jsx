import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const { updatePassword, formatAuthError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setToast('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setToast('Password updated successfully! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const msg = formatAuthError(err);
      setError(msg);
      setToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-pitch">
        <div className="wordmark"><b>cv</b> Carvia</div>
        <div>
          <div className="eyebrow"><i /> Reset Password</div>
          <h1>Choose a new<br /><em>secure password.</em></h1>
          <p>Update your credentials to regain full access to your Carvia workspace.</p>
        </div>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Set new password</h2>
          <p>Please enter your new password below.</p>

          {error && (
            <div style={{
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.875rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <label>
            New Password
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <label>
            Confirm New Password
            <input
              required
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>

          <button className="primary-button full" disabled={loading} style={{ marginTop: '12px' }}>
            {loading ? 'Updating password…' : 'Update Password →'}
          </button>
        </form>
      </section>
      <Toast message={toast} />
    </main>
  );
}
