const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

export interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user?: {
    id?: string;
    email?: string;
    role?: string;
    user_metadata?: {
      name?: string;
      job_title?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession =
    localStorage.getItem("auth_session") ??
    sessionStorage.getItem("auth_session");

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    localStorage.removeItem("auth_session");
    sessionStorage.removeItem("auth_session");

    return null;
  }
}

function saveSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  const useLocalStorage =
    localStorage.getItem("auth_session") !== null;

  const storage = useLocalStorage ? localStorage : sessionStorage;

  storage.setItem("auth_session", JSON.stringify(session));
}

export async function refreshAuthSession(): Promise<AuthSession | null> {
  const currentSession = getStoredSession();

  if (!currentSession?.refresh_token || !BASE_URL || !API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/auth/v1/token?grant_type=refresh_token`,
      {
        method: "POST",
        headers: {
          apikey: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: currentSession.refresh_token,
        }),
      },
    );

    if (!response.ok) {
      return null;
    }

    const refreshedSession =
      (await response.json()) as AuthSession;

    saveSession(refreshedSession);

    return refreshedSession;
  } catch (error) {
    console.error("Session refresh error:", error);

    return null;
  }
}

export async function getValidSession(): Promise<AuthSession | null> {
  const session = getStoredSession();

//   console.log("Stored session:", session);

//   if (!session) {
//     console.log("No stored session found.");
//     return null;
//   }

//   console.log(
//     "Current time:",
//     new Date().toISOString(),
//   );

//   console.log(
//     "Token expires at:",
//     new Date(session.expires_at * 1000).toISOString(),
//   );

//   console.log(
//     "Is token expired:",
//     Date.now() >= session.expires_at * 1000,
//   );

//   if (Date.now() < session.expires_at * 1000) {
//     console.log("Using existing access token.");
//     return session;
//   }

//   console.log("Access token expired. Attempting refresh...");

  const refreshedSession = await refreshAuthSession();

//   console.log(
//     "Refresh result:",
//     refreshedSession,
//   );

  return refreshedSession;
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("auth_session");
  sessionStorage.removeItem("auth_session");
}