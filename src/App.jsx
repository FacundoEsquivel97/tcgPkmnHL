import './App.css';
import NewCard from './components/NewCard.jsx';

function App() {

  return (
    <div>

      <h1>Mi Aplicación</h1>

      <div className="container">
        <NewCard type={1} />
        <NewCard type={2} />
      </div>
    </div>
  );
}

export default App;
