// secrets.js

if (process.env.REACT_APP_BACKEND_URL === undefined) {
  console.error('BACKEND_URL is not defined');
}
if (process.env.REACT_APP_FRONTEND_URL === undefined) {
  console.error('REACT_APP_FRONTEND_URL is not defined');
}


export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
export const FRONTEND_URL = process.env.VERCEL_URL || 'http://localhost:3000'; 
