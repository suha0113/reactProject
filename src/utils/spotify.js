const CLIENT_ID = "01d88266f7e14173beecabd680e704ea";
const REDIRECT_URI = "https://localhost:5173/callback";
const SCOPES = "user-read-private user-read-email";

// 랜덤 문자열 생성
function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// SHA-256 해시 생성
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

// Base64 URL-safe 인코딩
function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Spotify 인증 페이지로 이동
export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem("code_verifier", codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  };

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

// 코드로 AccessToken 가져오기
export async function getAccessToken(code) {
  const codeVerifier = localStorage.getItem("code_verifier");

  if (!codeVerifier) {
    throw new Error("Code verifier not found");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem("spotify_refresh_token", data.refresh_token);
    localStorage.setItem(
      "spotify_token_expiry",
      String(Date.now() + data.expires_in * 1000)
    );
    localStorage.removeItem("code_verifier");
    return data.access_token;
  }

  throw new Error("Failed to get access token");
}

// AccessToken 리프레시
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("spotify_refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    localStorage.setItem("spotify_access_token", data.access_token);
    localStorage.setItem(
      "spotify_token_expiry",
      String(Date.now() + data.expires_in * 1000)
    );
    return data.access_token;
  }

  throw new Error("Failed to refresh access token");
}

// 유효한 토큰 가져오기
export async function getValidAccessToken() {
  const accessToken = localStorage.getItem("spotify_access_token");
  const expiry = localStorage.getItem("spotify_token_expiry");

  if (!accessToken || !expiry) return null;

  if (Date.now() >= parseInt(expiry)) {
    try {
      return await refreshAccessToken();
    } catch {
      localStorage.removeItem("spotify_access_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_token_expiry");
      return null;
    }
  }

  return accessToken;
}

// 음악 검색
export async function searchTracks(query, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      query
    )}&type=track&limit=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to search tracks");

  const data = await response.json();
  return data.tracks.items;
}

// 시간 포맷 (3:25 형태로)
export function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// 로그아웃
export function logout() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expiry");
}
