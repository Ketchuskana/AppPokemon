import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import styles, { getDynamicStyles } from '../components/StyleList';
import { typeColors } from '../components/pokemonTypes';

// Définition des types pour les props et les données Pokémon
type PokemonListProps = {
  onPokemonClick: (pokemonName: string) => void;
};

type Pokemon = {
  name: string;
  url: string;
};

type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

type PokemonDetails = {
  id: number;
  name: string;
  types: PokemonType[];
};

const PokemonList: React.FC<PokemonListProps> = ({ onPokemonClick }) => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pokemonDetails] = useState<Record<string, PokemonDetails>>({});
  const [loading, setLoading] = useState(true);

  // Appel de la fonction pour récupérer la liste des Pokémon au montage de la composante
  useEffect(() => {
    fetchPokemonList();
  }, []);

  // Tri de la liste des Pokémon lorsque l'ordre de tri change
  useEffect(() => {
    sortPokemonList();
  }, [sortOrder, pokemonDetails]);


  // Fonction asynchrone pour récupérer la liste des Pokémon depuis l'API
  const fetchPokemonList = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
      const data = await response.json();
      setPokemonList(data.results);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch pokemon list:', error);
      setLoading(false);
    }
  };

  // Fonction pour afficher chaque élément de la liste des Pokémon
  const renderItem = ({ item }: { item: Pokemon }) => {
    const details = pokemonDetails[item.name];
    const dynamicStyles = details ? getDynamicStyles(details.types.map(type => ({ color: typeColors[type.type.name] }))) : styles;

    return (
      <TouchableOpacity onPress={() => onPokemonClick(item.name)} style={dynamicStyles.card}>
        <Image source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(item.url)}.png` }} style={styles.pokemonImage} />
        <Text style={styles.cardTitle}>{capitalizeFirstLetter(item.name)}</Text>
      </TouchableOpacity>
    );
  };

  // Fonction pour mettre en majuscule la première lettre d'un nom
  const capitalizeFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Fonction pour extraire l'ID d'un Pokémon à partir de son URL
  const getPokemonId = (url: string) => {
    const id = url.split('/')[6];
    return id;
  };

  // Fonction pour trier la liste des Pokémon en fonction de l'ordre choisi
  const sortPokemonList = () => {
    const sortedList = [...pokemonList].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setPokemonList(sortedList);
  };

  const handleSortAZ = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  // Fonction pour filtrer la liste des Pokémon en fonction de la chaîne de recherche
  const filterPokemonList = () => {
    return pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Affiche un indicateur de chargement pendant le chargement des données
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Affichage principal de la liste des Pokémon une fois que les données sont chargées avec succès
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
      </View>

      <FlatList
        data={filterPokemonList()}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default PokemonList;
