function NewCard({ cardData, loading }) {
    const rarity = cardData?.rarity || "Carta";

    const updatedAt = cardData?.pricing?.tcgplayer?.updatedAt || "Reciente";

    const imageUrl = cardData?.image ? `${cardData.image}/high.png` : "";

    return (
        <>
            {loading && <p>Cargando...</p>}
            {!loading && cardData && (
                <>
                    <p>
                        {rarity}{" "}
                        <span className="yellowSpan">Market price</span> from www.tcgplayer.com ({updatedAt})
                    </p>
                    <img 
                        className="cardImg" 
                        src={imageUrl} 
                        alt={cardData.name || "Pokémon Card"} 
                    />
                </>
            )}
        </>
    );
}

export default NewCard;