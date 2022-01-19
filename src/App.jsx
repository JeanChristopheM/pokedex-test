import { useEffect, useState, useRef } from "react";
import { getData } from "./logic";

const useEvent = (event, handler, passive = false) => {
  useEffect(() => {
    window.addEventListener(event, handler, passive);
    return () => {
      window.removeEventListener(event, handler);
    };
  });
};

const App = () => {
  //! Declaring my state variables
  const [pokemons, setPokemons] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [wantMore, setWantMore] = useState(false);

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
    initialLoad();
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
    setIsFetching(false);
  }, [nextPage]);

  //! Gets called when we hit the bottom of the page
  /* const onBottomHit = () => {
    if (isFetching) return;
    fetchMore();
  }; */
  useEffect(() => {
    if (isFetching) return;
    if (!wantMore) return;
    fetchMore();
  }, [wantMore]);

  //! Gets called when the user scrolls
  const handleScroll = () => {
    console.log("yoyo " + nextPage);
    if (!divRef.current) return;
    if (divRef.current.getBoundingClientRect().bottom <= window.innerHeight)
      setWantMore(true);
  };
  useEvent("scroll", handleScroll, true);

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
