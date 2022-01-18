import { useEffect, useState, useRef } from "react";
import { getData } from "./logic";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const divRef = useRef(null);

  const initialLoad = async () => {
    setIsFetching(true);
    const data = await getData("https://pokeapi.co/api/v2/pokemon");
    setPokemons(data.results);
    setNextPage(data.next);
    setPrevPage(data.previous);
  };

  const fetchMore = async () => {
    setIsFetching(true);
    const data = await getData(nextPage);
    setPokemons((prev) => [...prev, ...data.results]);
    setNextPage(data.next);
    setPrevPage(data.previous);
  };

  const onBottomHit = () => {
    if (isFetching) return;
    fetchMore();
  };

  const handleScroll = () => {
    if (!divRef.current) {
      return false;
    }
    if (divRef.current.getBoundingClientRect().bottom <= window.innerHeight)
      onBottomHit();
  };

  useEffect(() => {
    initialLoad();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log("ready");
    setIsFetching(false);
  }, [nextPage]);

  return (
    <>
      {pokemons.length == 0 ? (
        "No data"
      ) : (
        <div
          style={{ border: "1px solid gold" }}
          className="pokemon"
          ref={divRef}
        >
          {pokemons.map((pokemon) => {
            return (
              <div
                style={{
                  backgroundColor: "salmon",
                  padding: ".5rem",
                  width: "max-content",
                  margin: "1rem",
                }}
                key={pokemon.name}
                className="pokemonName"
              >
                {pokemon.name}
              </div>
            );
          })}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              background: "salmon",
            }}
            onClick={fetchMore}
          >
            Is fetching : {isFetching.toString()}
            <br />
            nextPage : {nextPage}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
