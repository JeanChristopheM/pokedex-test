import { useState, useRef, useCallback } from "react";
import usePokemonFetch from "./usePokemonFetch";
import { pokemonStyle, infoStyle } from "./style";

const App = () => {
  const [src, setSrc] = useState("https://pokeapi.co/api/v2/pokemon");

  const { pokemons, loading, error, nextSrc, prevSrc } = usePokemonFetch(src);

  const observer = useRef();
  const lastPokemon = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && nextSrc) {
          setSrc(nextSrc);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, nextSrc]
  );

  return (
    <div>
      <h1>Pokemons : </h1>
      <div className="pokemon">
        {pokemons.map((pokemon, index) => {
          if (pokemons.length === index + 1) {
            return (
              <div ref={lastPokemon} key={pokemon.name} style={pokemonStyle}>
                {pokemon.name}
              </div>
            );
          }
          return (
            <div key={pokemon.name} style={pokemonStyle}>
              {pokemon.name}
            </div>
          );
        })}
      </div>
      <div style={infoStyle}>
        <p>loading : {loading.toString()}</p>
        <p>nextSrc : {nextSrc}</p>
        <p>Error : {error.toString()}</p>
      </div>
      {loading ? <div>Loading ... </div> : null}
      {error ? <div>Error</div> : null}
    </div>
  );
};

export default App;
