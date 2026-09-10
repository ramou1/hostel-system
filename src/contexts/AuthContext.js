import React, { createContext, useContext, useCallback, useState } from "react";

const AUTH_KEY = "hostelzim:auth";

// Credenciais de demonstração (mockadas — futuramente virão de um backend)
export const DEMO_CREDENTIALS = {
  email: "admin@hostely.com",
  password: "hostel123",
};

const AuthContext = createContext(undefined);

function loadAuth() {
  try {
    const raw =
      localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadAuth);

  const login = useCallback((email, password, keepConnected) => {
    const matches =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    if (!matches) return { ok: false };

    const data = { email: DEMO_CREDENTIALS.email };
    // "Manter conectado" => persiste entre sessões (localStorage);
    // caso contrário, apenas na sessão atual (sessionStorage).
    const primary = keepConnected ? localStorage : sessionStorage;
    const secondary = keepConnected ? sessionStorage : localStorage;
    primary.setItem(AUTH_KEY, JSON.stringify(data));
    secondary.removeItem(AUTH_KEY);

    setUser(data);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return ctx;
}
