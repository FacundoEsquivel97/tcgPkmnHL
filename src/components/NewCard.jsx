function NewCard({ cardData, loading }) {

    const rarity = cardData ? JSON.stringify(cardData.tcgplayer.prices).split(`"`)[1] : "";


    return (
        <>
            {loading && <p>Cargando...</p>}
            {!loading && cardData && <>
                <p>{rarity.charAt(0).toUpperCase() + rarity.slice(1)} <span className="yellowSpan">Market price</span>  from www.tcgplayer.com {cardData.tcgplayer.updatedAt}</p>
                <img className="cardImg" src={cardData.images.small} />
            </>}
        </>);
}

export default NewCard; 