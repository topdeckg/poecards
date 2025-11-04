import { GameContainer } from './components/GameContainer'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Station Master</h1>
        <p className="subtitle">Manage your space station, fulfill resident demands</p>
      </header>
      <GameContainer />
    </div>
  )
}

export default App
