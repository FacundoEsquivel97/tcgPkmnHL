import { useEffect, useState } from 'react';
import './App.css';
import TCGdex from "@tcgdex/sdk";
import NewCard from './components/NewCard';
import GameOver from './components/GameOver';

function App() {
  const tcgdex = new TCGdex("es");
  tcgdex.setCacheTTL(-1);

  const [score, setScore] = useState(0);
  const [dataCard1, setDataCard1] = useState(null);
  const [dataCard2, setDataCard2] = useState(null);
  const [cardPrice1, setCardPrice1] = useState(null);
  const [cardPrice2, setCardPrice2] = useState(null);
  
  const [nextCardBuffer, setNextCardBuffer] = useState(null);

  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [gameState, setGameState] = useState(false);
  const [win, setWin] = useState(true);

  const [highScore, setHighScore] = useState(() => {
  const saved = localStorage.getItem('pokemon_tcg_highscore');
  return saved ? parseInt(saved, 10) : 0;
});

  const getRandomCard = async () => {
    try {
      const res = await fetch("https://api.tcgdex.net/v2/en/categories/Pokemon");
      const cardsList = await res.json();

      const randomIndex = Math.floor(Math.random() * cardsList?.cards?.length);
      const randomCardSummary = cardsList?.cards[randomIndex];

      const cardRes = await fetch(`https://api.tcgdex.net/v2/en/cards/${randomCardSummary.id}`);
      const cardData = await cardRes.json();

      const tcgPrices = cardData.pricing?.tcgplayer;
      let price = tcgPrices?.normal?.marketPrice || tcgPrices?.normal?.midPrice;

      if (!price && tcgPrices) {
        const variantKeys = Object.keys(tcgPrices).filter(
          (key) => key !== 'unit' && key !== 'updated'
        );
        if (variantKeys.length > 0) {
          price = tcgPrices[variantKeys[0]]?.marketPrice || tcgPrices[variantKeys[0]]?.midPrice;
        }
      }

      if (!price || !cardData.image) {
        return await getRandomCard();
      }

      return { cardData, price };

    } catch (error) {
      console.error("Error al obtener carta aleatoria:", error);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    !loading2 && gameState && setGameState(false);
  }, [loading2]);

  const preloadNextCard = async () => {
    const card = await getRandomCard();
    setNextCardBuffer(card);
  };

  const startGame = async () => {
    setLoading1(true);
    setLoading2(true);
    
    const firstCard = await getRandomCard();
    const secondCard = await getRandomCard();

    if (firstCard && secondCard) {
      setDataCard1(firstCard.cardData);
      setCardPrice1(firstCard.price);
      setLoading1(false);

      setDataCard2(secondCard.cardData);
      setCardPrice2(secondCard.price);
      setLoading2(false);

      preloadNextCard();
    }
  };

const advanceToNextCard = async () => {
  if (nextCardBuffer) {
    setDataCard2(nextCardBuffer.cardData);
    setCardPrice2(nextCardBuffer.price);
    setNextCardBuffer(null);
    preloadNextCard();
  } else {
    setLoading2(true);
    const nextCard = await getRandomCard();
    if (nextCard) {
      setDataCard2(nextCard.cardData);
      setCardPrice2(nextCard.price);
      setLoading2(false);
      preloadNextCard();
    }
  }
};

const handleGuess = async (isMoreExpensive) => {
  const correct = isMoreExpensive 
    ? cardPrice2 >= cardPrice1 
    : cardPrice2 <= cardPrice1;

  if (correct) {
    setScore(prev => prev + 1);
    setWin(true);
    setGameState(true);

    setTimeout(() => {
      setGameState(false);
      
      setDataCard1(dataCard2);
      setCardPrice1(cardPrice2);
      setLoading2(true); 

      setTimeout(() => {
        if (nextCardBuffer) {
          setDataCard2(nextCardBuffer.cardData);
          setCardPrice2(nextCardBuffer.price);
          setNextCardBuffer(null);
          setLoading2(false);
          preloadNextCard();
        } else {
          advanceToNextCard();
        }
      }, 50); 

    }, 600);

  } else {
  setWin(false);
  setGameState(true);
  
  if (score > highScore) {
    setHighScore(score);
    localStorage.setItem('pokemon_tcg_highscore', score.toString());
  }
  }
};
const restartGame = () => {
  setScore(0);
  setGameState(false);
  setWin(true);
  startGame();
};
const moreExpensive = () => handleGuess(true);
const cheaper = () => handleGuess(false);

  return (
    <>
      <div className="container">
        <div className="cardContainer">
          <NewCard cardData={dataCard1} loading={loading1} />
          <div className='infoContainer'>
            {cardPrice1 && !loading1 &&
              <p className="price">${cardPrice1}</p>}
          </div>
        </div>

        <div className={gameState ? win ? "scoreContainer win" : "scoreContainer lose" :
          "scoreContainer"}>
          Puntaje: {score}
        </div>

        <div className={
          gameState ? win ? "cardContainer win" : "cardContainer lose" :
            "cardContainer"
        }>
          <NewCard cardData={dataCard2} loading={loading2} />
          <div className='infoContainer'>
            {cardPrice2 && !loading2 && !loading1 && win &&
              <>
                <button onClick={moreExpensive}>Mas cara</button>
                <button onClick={cheaper}>Mas barata</button>
              </>}
            {cardPrice2 && !loading1 && !win && gameState &&
              <p className="price">${cardPrice2}</p>}
          </div>
        </div>
      </div>
      {!win && gameState && (
        <GameOver score={score} highScore={highScore} restartGame={restartGame} />
)}
    </>
  );
}

export default App;