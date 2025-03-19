import { useEffect, useState } from "react";

function NewCard({ type }) {
    const [dataSet, setDataSet] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData1 = async () => {
        setLoading(true);
        try {
            const res = await fetch("https://api.pokemontcg.io/v2/sets");
            const result = await res.json();
            setDataSet(result.data[Math.floor(Math.random() * (result.count - 0))]);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };
    const fetchData2 = async () => {
        try {
            const res = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${dataSet.id} number:${Math.floor(Math.random() * (dataSet.total - 0))}`);
            const result = await res.json();
            setData(result.data[0]);
            console.log(result.data[0], 'result');
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData1();
    }, []);

    useEffect(() => {
        dataSet && fetchData2();

    }, [dataSet]);


    const rarity = data ? JSON.stringify(data.tcgplayer.prices).split(`"`)[1] : "";
    return (
        <div className="cardContainer">
            {loading && <p>Cargando...</p>}
            {!loading && data && <>
                <p>{rarity.charAt(0).toUpperCase() + rarity.slice(1)} <span className="yellowSpan">Market price</span>  from www.tcgplayer.com {data.tcgplayer.updatedAt}</p>
                <img className="cardImg" src={data.images.small} />
                {type == 1 ?
                    <p className="price">${Object.values(data.tcgplayer.prices)[0].market}</p> :
                    <>
                        <button>More expensive</button>
                        <button>Cheaper</button>
                    </>
                }
            </>}
        </div>);
}

export default NewCard; 