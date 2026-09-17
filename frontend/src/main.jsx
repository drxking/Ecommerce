import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// The API is hosted on a different origin in production. This is required for
// the browser to accept and send the secure authentication cookie.
axios.defaults.withCredentials = true

createRoot(document.getElementById('root')).render(
    <App />
)
