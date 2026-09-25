function GameOver({ score, highScore, restartGame }) {
    return (
    <div className="game-over-overlay">
    <div className="game-over-card">
      <h2>¡Juego Terminado!</h2>
      <p className="final-score">Puntaje obtenido: <span>{score}</span></p>
      {score >= highScore && score > 0 && (
        <p className="new-record">¡Nuevo Récord Personal!</p>
      )}
      <p className="high-score">Mejor Puntuación: {Math.max(score, highScore)}</p>
      
      <button className="restart-btn" onClick={restartGame}>
        Reintentar 
      </button>
    </div>
  </div>)}

  export default GameOver;