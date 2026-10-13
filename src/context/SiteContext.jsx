import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultContent, mergeContent } from '../data/content';
import { api } from '../lib/api';

const SiteContext = createContext(null);
const ADMIN_HINT = 'vp_admin_hint';
const LOAD_TIMEOUT = 2500;

const hint = {
  get: () => {
    try {
      return localStorage.getItem(ADMIN_HINT) === '1';
    } catch {
      return false;
    }
  },
  set: (on) => {
    try {
      if (on) localStorage.setItem(ADMIN_HINT, '1');
      else localStorage.removeItem(ADMIN_HINT);
    } catch {
      /* storage blocked — the hint is only an optimisation */
    }
  },
};

/** Holds the live site content (what the page renders) plus the admin session state. */
export function SiteProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [saved, setSaved] = useState(() => JSON.stringify(defaultContent));
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const contentRef = useRef(content);
  contentRef.current = content;

  // Load the published content (and, only for a returning admin, check the session cookie).
  useEffect(() => {
    let cancelled = false;
    const timeout = new Promise((resolve) => setTimeout(() => resolve('timeout'), LOAD_TIMEOUT));
    const load = Promise.all([api.content().catch(() => null), hint.get() ? api.me().catch(() => null) : null]);

    Promise.race([load, timeout]).then((result) => {
      if (cancelled) return;
      if (result !== 'timeout') {
        const [published, me] = result;
        const merged = mergeContent(published?.content);
        setContent(merged);
        setSaved(JSON.stringify(merged));
        if (me?.admin) setAdmin(true);
        else hint.set(false);
      }
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.title = `${content.profile.name} — ${content.hero.eyebrow}`;
  }, [content.profile.name, content.hero.eyebrow]);

  const dirty = useMemo(() => admin && JSON.stringify(content) !== saved, [admin, content, saved]);

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  /** Mutates a deep copy of the content: edit((draft) => { draft.hero.name = 'x'; }) */
  const edit = useCallback((fn) => {
    setContent((current) => {
      const draft = structuredClone(current);
      fn(draft);
      return draft;
    });
  }, []);

  const login = useCallback(async (password) => {
    await api.login(password);
    hint.set(true);
    setAdmin(true);
    setLoginOpen(false);
    setPanelOpen(true);
  }, []);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    hint.set(false);
    setAdmin(false);
    setPanelOpen(false);
    // Throw away unsaved edits so the public view shows only what is published.
    setContent(JSON.parse(saved));
  }, [saved]);

  const save = useCallback(async () => {
    const snapshot = contentRef.current;
    try {
      await api.saveContent(snapshot);
    } catch (err) {
      if (err.status === 401) {
        hint.set(false);
        setAdmin(false);
      }
      throw err;
    }
    setSaved(JSON.stringify(snapshot));
  }, []);

  const discard = useCallback(() => setContent(JSON.parse(saved)), [saved]);
  const resetToDefaults = useCallback(() => setContent(structuredClone(defaultContent)), []);

  const value = {
    content,
    edit,
    ready,
    admin,
    dirty,
    panelOpen,
    setPanelOpen,
    loginOpen,
    setLoginOpen,
    login,
    logout,
    save,
    discard,
    resetToDefaults,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
