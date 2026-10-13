import { useEffect, useRef, useState } from 'react';
import { useSite } from '../../context/SiteContext';
import '../../styles/admin.css';

export default function LoginModal() {
  const { login, setLoginOpen } = useSite();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setLoginOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [setLoginOpen]);

  const submit = async (e) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError('');
    try {
      await login(password);
    } catch (err) {
      setError(err.message);
      setPassword('');
      setBusy(false);
      input.current?.focus();
    }
  };

  return (
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && setLoginOpen(false)}>
      <form className="adm-login" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="adm-lt">
        <button type="button" className="adm-x" aria-label="Close" onClick={() => setLoginOpen(false)}>
          ✕
        </button>
        <span className="lab">Admin</span>
        <h2 id="adm-lt">Welcome back</h2>
        <p>Log in to edit your portfolio.</p>
        <label className="adm-pw">
          <input
            ref={input}
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            maxLength={200}
          />
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? 'Hide' : 'Show'}
          </button>
        </label>
        {error && (
          <div className="adm-err" role="alert">
            {error}
          </div>
        )}
        <button type="submit" className="btn y adm-go" disabled={busy || !password}>
          {busy ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
