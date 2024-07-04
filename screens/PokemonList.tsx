import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
import styles from '../components/StyleList';
import { typeColors } from '../components/pokemonTypes';

type PokemonListProps = {
  onPokemonClick: (pokemonName: string) => void;
};

const PokemonList: React.FC<PokemonListProps> = ({ onPokemonClick }) => {
  const [pokemonList, setPokemonList] = useState<{ name: string, url: string }[]>([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState<{ name: string, url: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); 
  const [selectedType, setSelectedType] = useState<string | null>(null);

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
  }, [searchQuery, selectedType]);

  useEffect(() => {
    sortPokemonList();
  }, [sortOrder]);

  const sortPokemonList = () => {
    const sortedList = [...filteredPokemonList].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFilteredPokemonList(sortedList);
  };

  const handleSortAZ = () => {
    if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder('asc');
    }
  };

  const filterPokemonList = () => {
    let filteredList = pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (selectedType) {
      filteredList = filteredList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    setFilteredPokemonList(filteredList);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pokemons List</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un Pokémon..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity onPress={handleSortAZ} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Trier par A-Z</Text>
        </TouchableOpacity>
        {/* Logique de filtrage par type non terminé */}
        {/* <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedType}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedType(itemValue)}>
            <Picker.Item label="Types" value={null} />
            <Picker.Item label="Grass" value="grass" />
            <Picker.Item label="Fire" value="fire" />
            <Picker.Item label="Water" value="water" />
            <Picker.Item label="Normal" value="normal" />
            <Picker.Item label="Bug" value="bug" />
            <Picker.Item label="Flying" value="flying" />
            <Picker.Item label="Rock" value="rock" />
            <Picker.Item label="Electric" value="electric" />
            <Picker.Item label="Poison" value="poison" />
            <Picker.Item label="Ground" value="ground" />
            <Picker.Item label="Fighting" value="fighting" />
            <Picker.Item label="Psychic" value="psychic" />
            <Picker.Item label="Steel" value="steel" />
            <Picker.Item label="Ice" value="ice" />
            <Picker.Item label="Ghost" value="ghost" />
            <Picker.Item label="Dragon" value="dragon" />
            <Picker.Item label="Dark" value="dark" />
            <Picker.Item label="Fairy" value="fairy" />
            <Picker.Item label="Shadow" value="shadow" />
            <Picker.Item label="Unknown" value="unknown" />
          </Picker>
        </View> */}
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
