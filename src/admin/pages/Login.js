import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { useAdmin } from '../AdminContext';

function Login() {
  const { signIn } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signIn(email, password, remember);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card card">
        <div className="admin-login__brand">
          <Logo />
          <span className="admin__tag">Admin</span>
        </div>
        <h1 className="h3">Owner sign in</h1>
        <p className="muted">Manage your cars, business info and reviews.</p>

        <form onSubmit={onSubmit} className="admin-login__form" noValidate>
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              className="input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-login__token">
              <input
                id="admin-password"
                className="input"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'admin-login-err' : undefined}
              />
              <button type="button" className="admin-login__show" onClick={() => setShow((s) => !s)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && (
            <p id="admin-login-err" className="field-error" role="alert">
              {error}
            </p>
          )}
          <label className="admin-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me signed in on this device
          </label>
          <button type="submit" className="btn btn--accent btn--lg btn--block" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="admin-login__foot muted">Forgot your password? Contact your website developer to reset it.</p>
      </div>
      <Link to="/" className="admin-login__back">
        <Icon name="arrowLeft" size={16} /> Back to website
      </Link>
    </div>
  );
}

export default Login;
