export const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

export const SOCKJS_URL = `${BACKEND_URL}/ws`;
