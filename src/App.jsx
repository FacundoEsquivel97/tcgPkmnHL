import { useEffect, useState } from 'react';
import './App.css';
import NewCard from './components/NewCard.jsx';

function App() {
  const [dataSet1, setDataSet1] = useState(null);
  const [dataSet2, setDataSet2] = useState(null);
  const [score, setScore] = useState(0);
  const [dataCard1, setDataCard1] = useState(null);
  const [dataCard2, setDataCard2] = useState(null);
  const [cardPrice1, setCardPrice1] = useState(null);
  const [cardPrice2, setCardPrice2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [gameState, setGameState] = useState(false);
  const [win, setWin] = useState(true);

  useEffect(() => {
    getSet1();
    getSet2();
  }, []);

  const getSet1 = async () => {
    setLoading1(true);
    try {
      const res = await fetch("https://api.pokemontcg.io/v2/sets", {
        headers: {
          "Authorization": `X-API-Key ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        }
      });
      const result = await res.json();
      setDataSet1(result.data[Math.floor(Math.random() * (result.count - 0))]);
    } catch (error) {
      console.error("Error al obtener datos del getSet:", error);
    }
  };

  const getSet2 = async () => {
    setLoading2(true);
    try {
      const res = await fetch("https://api.pokemontcg.io/v2/sets", {
        headers: {
          "Authorization": `X-API-Key ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        }
      });
      const result = await res.json();
      setDataSet2(result.data[Math.floor(Math.random() * (result.count - 0))]);
    } catch (error) {
      console.error("Error al obtener datos del getSet:", error);
    }
  };

  useEffect(() => {
    dataSet1 && getCard1();
  }, [dataSet1]);

  useEffect(() => {
    dataSet2 && getCard2();
  }, [dataSet2]);

  useEffect(() => {
    !loading2 && gameState && setGameState(false);
  }, [loading2]);

  const getCard1 = async () => {
    try {
      const randomNum = Math.floor(Math.random() * (dataSet1.total - 0) + 1);
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${dataSet1.id} number:${randomNum}`, {
        headers: {
          "Authorization": `X-API-Key ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        }
      });
      const result = await res.json();
      setDataCard1(result.data[0]);
      setCardPrice1(result ? Object.values(result.data[0].tcgplayer.prices)[0].market : null);
      setLoading1(false);
    } catch (error) {
      console.error("Error al obtener datos de getCard:", error);
      getSet1();
    }

  };

  const getCard2 = async () => {
    try {
      const randomNum = Math.floor(Math.random() * (dataSet2.total - 0) + 1);
      const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${dataSet2.id} number:${randomNum}`, {
        headers: {
          "Authorization": `X-API-Key ${import.meta.env.VITE_API_KEY}`,
          "Content-Type": "application/json",
        }
      });
      const result = await res.json();
      setDataCard2(result.data[0]);
      setCardPrice2(result ? Object.values(result.data[0].tcgplayer.prices)[0].market : null);
      setLoading2(false);
    } catch (error) {
      console.error("Error al obtener datos de getCard:", error);
      getSet2();
    }

  };


  const moreExpensive = () => {
    if (cardPrice1 <= cardPrice2) {
      setScore(score + 1);
      setWin(true);
      setDataCard1(dataCard2);
      setCardPrice1(cardPrice2);
      getSet2();
    } else {
      setWin(false);
    }
    setGameState(true);
  };

  const cheaper = () => {
    if (cardPrice1 >= cardPrice2) {
      setScore(score + 1);
      setDataCard1(dataCard2);
      setCardPrice1(cardPrice2);
      getSet2();
    } else {
      setWin(false);
    }
    setGameState(true);
  };

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

    </>
  );
}

export default App;
