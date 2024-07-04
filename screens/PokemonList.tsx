import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import styles from '../components/StyleList'; 
import { typeColors } from './PokemonDetail';

type PokemonListProps = {
  onPokemonClick: (pokemonName: string) => void;
};

const PokemonList: React.FC<PokemonListProps> = ({ onPokemonClick }) => {
  const [pokemonList, setPokemonList] = useState<{ name: string, url: string }[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<{ name: string, url: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      .then(response => response.json())
      .then(data => {
        setPokemonList(data.results);
        setFilteredPokemonList(data.results);
      })
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }: { item: { name: string, url: string } }) => (
    <TouchableOpacity onPress={() => onPokemonClick(item.name)} style={[styles.card, { borderColor: typeColors[item.name.toLowerCase()] || '#BDBDBD' }]}>
      <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(item.url)}.png` }} style={styles.pokemonImage} />
      <Text style={styles.cardTitle}>{capitalizeFirstLetter(item.name)}</Text>
    </TouchableOpacity>
  );

  const capitalizeFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getPokemonId = (url: string) => {
    const id = url.split('/')[6];
    return id;
  };

  useEffect(() => {
    filterPokemonList();
  }, [searchQuery]);

  const filterPokemonList = () => {
    const filteredList = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPokemonList(filteredList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pokemons List</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokemon..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      <FlatList
        data={filteredPokemonList}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default PokemonList;
