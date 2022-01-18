import { useEffect, useState, useRef } from "react";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const divRef = useRef(null);

  const getEvents = async (src) => {
    if (isFetching) return;
    setIsFetching(true);
    const response = await fetch(src);
    const data = await response.json();
    // ! FIRST LOG
    console.log(
      "Just fetched. The next url is : " + data.next + " -> " + typeof data.next
    );
    if (data.next) {
      setNextPage(data.next);
      // ! SECOND LOG
      console.log("Set state of nextPage to : " + data.next);
    }
    // ! THIRD LOG
    console.log("Current state after setting : " + nextPage);
    if (data.previous) setPrevPage(data.previous);
    setIsFetching(false);
    return data.results;
  };

  const initialLoad = async () => {
    const data = await getEvents("https://pokeapi.co/api/v2/pokemon");
    setPokemons(data);
  };

  const fetchMore = async () => {
    console.log("Making request with : " + nextPage);
    setNextPage(nextPage);
    const data = await getEvents(nextPage);
    setPokemons((old) => [...old, ...data]);
    setIsFetching(false);
  };
  const onBottomHit = () => {
    //console.log("hit bottom : " + nextPage);
    /* if (isFetching) return;
    setIsFetching(true);
    fetchMore(); */
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

  const getMoar = () => {
    fetchMore();
  };
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
          <button onClick={getMoar}>MOAR</button>
        </div>
      )}
    </>
  );
};

export default App;
