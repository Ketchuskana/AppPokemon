import React, { useState } from 'react';
import { View } from 'react-native';
import PokemonList from './screens/PokemonList';
import PokemonDetail from './screens/PokemonDetail';

const App: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const handlePokemonClick = (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
  };

  const handleBack = () => {
    setSelectedPokemon(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {selectedPokemon ? (
        <PokemonDetail pokemonName={selectedPokemon} onBack={handleBack} />
      ) : (
        <PokemonList onPokemonClick={handlePokemonClick} />
      )}
    </View>
  );
};

export default App;
