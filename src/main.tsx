import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App'
import { GameProvider } from './app/providers/GameProvider'
import { LanguageProvider } from './app/providers/LanguageProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <GameProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </GameProvider>
    </BrowserRouter>
  </React.StrictMode>,
)