const AUTH_KEY = "hrxauth";

// Save auth data
export const setAuth = (data: {
  token: string;
  hrx_session_id: string;
  user: {
    user_id: number | string;
    name: string;
    email: string;
  };
}) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

// Get full auth object
export const getAuth = () => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

// Get token only
export const getToken = () => {
  const auth = getAuth();
  return auth?.token || null;
};

// Get user only
export const getUser = () => {
  const auth = getAuth();
  return auth?.user || null;
};

export const getSessionId = () => {
  const auth = getAuth();
  return auth?.hrx_session_id || null;
};

// Clear auth (logout)
export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};
