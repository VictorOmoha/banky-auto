import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { useAdmin } from '../AdminContext';
import { newTokenUrl, repo, repoUrl } from '../config';

function Login() {
  const { signIn } = useAdmin();
  const [token, setToken] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Paste your GitHub access token to continue.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await signIn(token, remember);
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
        <p className="muted">Manage your cars, business info and reviews. Changes publish to the live site automatically.</p>

        <form onSubmit={onSubmit} className="admin-login__form" noValidate>
          <div className="field">
            <label htmlFor="admin-token">GitHub access token</label>
            <div className="admin-login__token">
              <input
                id="admin-token"
                className="input"
                type={show ? 'text' : 'password'}
                autoComplete="off"
                spellCheck="false"
                placeholder="github_pat_…"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'admin-token-err' : undefined}
              />
              <button type="button" className="admin-login__show" onClick={() => setShow((s) => !s)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && (
              <span id="admin-token-err" className="field-error">
                {error}
              </span>
            )}
          </div>
          <label className="admin-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Keep me signed in on this device
          </label>
          <button type="submit" className="btn btn--accent btn--lg btn--block" disabled={busy}>
            {busy ? 'Checking…' : 'Sign in'}
          </button>
        </form>

        <details className="admin-login__help">
          <summary>
            <Icon name="key" size={16} /> First time? How to get a token
          </summary>
          <ol>
            <li>
              Sign in to GitHub with the account that owns{' '}
              <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                {repo.owner}/{repo.name}
              </a>
              .
            </li>
            <li>
              Open{' '}
              <a href={newTokenUrl} target="_blank" rel="noopener noreferrer">
                New fine-grained token
              </a>
              . Name it “Banky Auto admin” and pick an expiration.
            </li>
            <li>
              Under <strong>Repository access</strong>, choose <strong>Only select repositories</strong> →{' '}
              <strong>{repo.name}</strong>.
            </li>
            <li>
              Under <strong>Permissions</strong>, set <strong>Contents</strong> to <strong>Read and write</strong>, and{' '}
              <strong>Actions</strong> to <strong>Read-only</strong> (to see publishing progress).
            </li>
            <li>Click Generate token, copy it, and paste it above.</li>
          </ol>
          <p className="muted">Your token stays in this browser and is only ever sent to GitHub.</p>
        </details>
      </div>
      <Link to="/" className="admin-login__back">
        <Icon name="arrowLeft" size={16} /> Back to website
      </Link>
    </div>
  );
}

export default Login;
