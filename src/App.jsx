import { useEffect, useState, useRef } from "react";
import { getData } from "./logic";

const App = () => {
  //! Declaring my state variables
  const [pokemons, setPokemons] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  //! Putting a ref on my main div
  const divRef = useRef(null);

  //! Gets called once on app launch by the useEffect below
  const initialLoad = async () => {
    setIsFetching(true);
    const data = await getData("https://pokeapi.co/api/v2/pokemon");
    setPokemons(data.results);
    setNextPage(data.next);
    setPrevPage(data.previous);
  };

  //! Only executed on app mount (once)
  useEffect(() => {
    //! INITIAL FETCH
    initialLoad();
    //! ADDING AN EVENT LISTENER
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //! Gets called either on btn Click or on scroll down at bottom of page
  const fetchMore = async () => {
    setIsFetching(true);
    const data = await getData(nextPage);
    setPokemons((prev) => [...prev, ...data.results]);
    setNextPage(data.next);
    setPrevPage(data.previous);
  };

  //! Gets called once the nextPage state variable changes
  useEffect(() => {
    console.log("ready");
    setIsFetching(false);
  }, [nextPage]);

  //! Gets called when we hit the bottom of the page
  const onBottomHit = () => {
    if (isFetching) return;
    fetchMore();
  };

  //! Gets called when the user scrolls
  const handleScroll = () => {
    if (!divRef.current) {
      return false;
    }
    if (divRef.current.getBoundingClientRect().bottom <= window.innerHeight)
      onBottomHit();
  };

  //! Return statement
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
          {/* // ! Floating div in the middle of the page */}
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
