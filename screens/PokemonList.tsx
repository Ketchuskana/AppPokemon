import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../components/StyleList'; 

type PokemonListProps = {
  onPokemonClick: (pokemonName: string) => void;
};

const PokemonList: React.FC<PokemonListProps> = ({ onPokemonClick }) => {
  const [pokemonList, setPokemonList] = useState<{ name: string, url: string }[]>([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        setPokemonList(data.results);
      })
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }: { item: { name: string, url: string } }) => (
    <TouchableOpacity onPress={() => onPokemonClick(item.name)} style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pokemons List</Text>
      <FlatList
        data={pokemonList}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default PokemonList;
