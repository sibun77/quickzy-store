import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <Toaster/>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
