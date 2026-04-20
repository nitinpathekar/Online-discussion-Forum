// Backend base URL — the proxy in package.json handles it in dev
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export { BASE_URL };
