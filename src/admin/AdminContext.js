import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { commitFiles, latestDeploy, login, me, readJson } from './api';
import { paths } from './config';

const AdminContext = createContext(null);
const STORAGE_KEY = 'banky-admin-session';

const storage = {
  get() {
    try {
      return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(token, remember) {
    try {
      (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, token);
    } catch {
      /* private mode: token lives in memory only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const toJsonText = (data) => `${JSON.stringify(data, null, 2)}\n`;

export function AdminProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [phase, setPhase] = useState('checking'); // checking | signed-out | loading | ready | error
  const [error, setError] = useState('');
  const [content, setContent] = useState({ vehicles: [], site: null, reviews: [] });
  const [deploy, setDeploy] = useState(null); // { state, url, at }
  const pollRef = useRef(null);

  const load = useCallback(async (tok) => {
    setPhase('loading');
    setError('');
    try {
      const [vehicles, site, reviews] = await Promise.all([
        readJson(tok, paths.vehicles),
        readJson(tok, paths.site),
        readJson(tok, paths.reviews),
      ]);
      setContent({ vehicles, site, reviews });
      setPhase('ready');
    } catch (err) {
      setError(err.message);
      setPhase('error');
    }
  }, []);

  const signIn = useCallback(
    async (email, password, remember) => {
      const { token: session, user: profile } = await login(email.trim(), password);
      storage.set(session, remember);
      setToken(session);
      setUser(profile);
      await load(session);
    },
    [load]
  );

  const signOut = useCallback(() => {
    storage.clear();
    clearTimeout(pollRef.current);
    setToken(null);
    setUser(null);
    setDeploy(null);
    setContent({ vehicles: [], site: null, reviews: [] });
    setPhase('signed-out');
  }, []);

  // Restore a saved session on first load.
  useEffect(() => {
    const saved = storage.get();
    if (!saved) {
      setPhase('signed-out');
      return;
    }
    me(saved)
      .then((profile) => {
        setToken(saved);
        setUser(profile);
        return load(saved);
      })
      .catch(() => {
        storage.clear();
        setPhase('signed-out');
      });
  }, [load]);

  useEffect(() => () => clearTimeout(pollRef.current), []);

  const watchDeploy = useCallback(
    (tok, sha) => {
      clearTimeout(pollRef.current);
      const started = Date.now();
      setDeploy({ state: 'queued', at: started });
      const tick = async () => {
        try {
          const run = await latestDeploy(tok);
          if (run && run.sha === sha) {
            if (run.status === 'completed') {
              setDeploy({ state: run.conclusion === 'success' ? 'success' : 'failure', url: run.url, at: Date.now() });
              return;
            }
            setDeploy({ state: 'publishing', url: run.url, at: started });
          }
        } catch {
          // Status unavailable; fall back to a time-based message.
          setDeploy({ state: 'unknown', at: started });
          return;
        }
        if (Date.now() - started < 8 * 60 * 1000) pollRef.current = setTimeout(tick, 8000);
        else setDeploy({ state: 'unknown', at: started });
      };
      pollRef.current = setTimeout(tick, 4000);
    },
    []
  );

  /**
   * Re-reads the latest file from GitHub, applies `mutate`, and commits it
   * (plus any extra files such as photos) in a single commit.
   */
  const save = useCallback(
    async ({ key, mutate, message, extraFiles }) => {
      try {
        const fresh = await readJson(token, paths[key]);
        const next = mutate(fresh);
        const files = [{ path: paths[key], text: toJsonText(next) }, ...(extraFiles ? extraFiles(next, fresh) : [])];
        const sha = await commitFiles(token, message, files);
        setContent((c) => ({ ...c, [key]: next }));
        watchDeploy(token, sha);
        return next;
      } catch (err) {
        if (err.status === 401) signOut();
        throw err;
      }
    },
    [token, watchDeploy, signOut]
  );

  const value = { token, user, phase, error, content, deploy, signIn, signOut, reload: () => load(token), save };
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = () => useContext(AdminContext);
