import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import styles from '../components/StyleList';
import useSWR from 'swr';

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

const apiBaseUrl = 'https://pokeapi.co/api/v2/pokemon';

const fetcher = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const PokemonList: React.FC<PokemonListProps> = ({ onPokemonClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState<Record<string, PokemonDetails>>({});
  const [offset, setOffset] = useState(0);
  const limit = 21;

  // URL de l'API avec pagination
  const getPokemonListUrl = (offset: number) => `${apiBaseUrl}?limit=${limit}&offset=${offset}`;

  // Utilisation de SWR pour gérer la récupération des données avec pagination
  const { data, error, isValidating, mutate } = useSWR(getPokemonListUrl(offset), fetcher);

  useEffect(() => {
    if (data) {
      const newDetails = { ...pokemonDetails };
      data.results.forEach(pokemon => {
        newDetails[pokemon.name] = pokemon;
      });
      setPokemonDetails(newDetails);
    }
  }, [data]);

  const pokemonList = data?.results || [];

  // Fonction pour charger la page suivante
  const loadNextPage = () => {
    if (data?.next) {
      setOffset(prevOffset => prevOffset + limit);
    }
  };

  // Fonction pour charger la page précédente
  const loadPreviousPage = () => {
    if (offset > 0) {
      setOffset(prevOffset => prevOffset - limit);
    }
  };

  const filterPokemonList = (pokemonList) => {
    return pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Fonction pour afficher chaque élément de la liste des Pokémon
  const renderItem = ({ item }: { item: Pokemon }) => {
    const details = pokemonDetails[item.name];

    return (
      <TouchableOpacity onPress={() => onPokemonClick(item.name)} style={styles.card}>
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

  // Affiche un indicateur de chargement pendant le chargement des données
  if (!data && isValidating) {
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

      <FlatList
        data={filterPokemonList(pokemonList)}
        keyExtractor={item => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListFooterComponent={() => (
          isValidating && <ActivityIndicator size="small" color="#0000ff" />
        )}
      />

      {/* Boutons de navigation */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={loadPreviousPage} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Page précédente</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={loadNextPage} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Page suivante</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PokemonList;
