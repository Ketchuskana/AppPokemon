import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import FetchTalentDescription from '../components/FetchTalentDescription';
import styles, { getDynamicStyles } from '../components/StyleDetail';
import { typeColors, typeIcons } from '../components/pokemonTypes';



type PokemonDetailProps = {
  pokemonName: string;
  onBack: () => void;
};

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonName, onBack }) => {
  // État pour stocker les détails du Pokémon
  const [pokemonDetail, setPokemonDetail] = useState<any>(null); 
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true); 
  // État pour gérer les erreurs de chargement
  const [error, setError] = useState<string | null>(null); 
  // État pour stocker la chaîne d'évolution du Pokémon
  const [evolutionChain, setEvolutionChain] = useState<string[]>([]); 
  // État pour stocker les faiblesses du Pokémon
  const [weaknesses, setWeaknesses] = useState<string[]>([]); 


  // Appel de la fonction pour récupérer les détails du Pokémon au montage de la composante
  useEffect(() => {
    fetchPokemonDetails(); 
  }, [pokemonName]);

  // Fonction asynchrone pour récupérer les détails du Pokémon et autres données associées
  const fetchPokemonDetails = async () => {
    try {
      setLoading(true);

      // Récupération des détails du Pokémon
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!pokemonResponse.ok) {
        throw new Error('Réponse réseau incorrecte');
      }
      const pokemonData = await pokemonResponse.json();
      setPokemonDetail(pokemonData);

      // Récupération des détails de l'espèce pour obtenir l'URL de la chaîne d'évolution
      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();
      const evolutionChainUrl = speciesData.evolution_chain.url;

      // Récupération des données de la chaîne d'évolution
      const evolutionChainResponse = await fetch(evolutionChainUrl);
      const evolutionChainData = await evolutionChainResponse.json();
      const chain = parseEvolutionChain(evolutionChainData.chain, pokemonName);
      setEvolutionChain(chain);

      // Récupération des types pour obtenir les faiblesses
      const typesUrls = pokemonData.types.map((type: any) => type.type.url);
      const typesResponses = await Promise.all(typesUrls.map(url => fetch(url).then(response => response.json())));
      const weaknesses = typesResponses.flatMap((typeData: any) => {
        return typeData.damage_relations.double_damage_from.map((weakness: any) => weakness.name);
      });
      setWeaknesses(weaknesses);

      setLoading(false);
    } catch (error) {
      console.error('Échec de la récupération des détails du Pokémon :', error);
      setError('Échec du chargement des détails du Pokémon');
      setLoading(false); 
    }
  };

  // Fonction pour parcourir la chaîne d'évolution
  const parseEvolutionChain = (chain: any, currentPokemonName: string): string[] => {
    const result: string[] = [];
    traverseChain(chain, currentPokemonName, result);
    return result;
  };

  // Fonction pour traverser la chaîne d'évolution
  const traverseChain = (chain: any, currentPokemonName: string, result: string[]) => {
    if (!chain) return;
    if (chain.species.name === currentPokemonName) {
      const evolvesTo = chain.evolves_to;
      evolvesTo.forEach((evolution: any) => {
        result.push(evolution.species.name);
        traverseChain(evolution, currentPokemonName, result);
      });
    } else {
      const evolvesTo = chain.evolves_to;
      evolvesTo.forEach((evolution: any) => {
        traverseChain(evolution, currentPokemonName, result);
      });
    }
  };

  // Affiche un indicateur de chargement pendant le chargement des données
  if (loading) {
    return (
      <View style={styles.scrollContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Affiche un message d'erreur si une erreur survient lors de la récupération des données
  if (error) {
    return (
      <View style={styles.scrollContainer}>
        <Text>Erreur : {error}</Text>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retour à la liste</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Style ombre dynamique en fonction des types de Pokémon
  const dynamicStyles = getDynamicStyles(pokemonDetail.types.map((type: any) => ({
    name: type.type.name,
    color: typeColors[type.type.name] || typeColors.unknown,
  })));

  // Affiche les détails du Pokémon une fois que les données sont chargées avec succès
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={styles.header}>
          <Text style={styles.name}>{pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.slice(1)}</Text>
          <Text style={styles.hp}>PV {pokemonDetail.stats.find((stat: any) => stat.stat.name === 'hp').base_stat}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.imageInfo}>Niveau: {pokemonDetail.base_experience}</Text>
          <Text style={styles.imageInfo}>Évolution : </Text>
          {evolutionChain.length > 0 ? (
            <Text style={styles.imageInfo}>
              {evolutionChain.map((evolutionName, index) => (
                <Text key={index}>{evolutionName}</Text>
              ))}
            </Text>
          ) : (
            <Text style={styles.imageInfo}>Aucune évolution supplémentaire</Text>
          )}
          <Image
            source={{ uri: pokemonDetail.sprites.front_default }}
            style={styles.image}
          />
          <Text style={styles.imageInfo}>Taille : {pokemonDetail.height / 10} m Poids : {pokemonDetail.weight / 10} kg</Text>
        </View>

        <View style={styles.typesContainer}>
          {pokemonDetail.types.map((type: any) => (
            <View key={type.type.name} style={[styles.typeContainer, { backgroundColor: typeColors[type.type.name] }]}>
              <Image
                source={typeIcons[type.type.name]}
                style={styles.typeIcon}
              />
              <Text style={styles.typeText}>{type.type.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.talentsContainer}>
          {pokemonDetail.moves.slice(0, 2).map((move: any) => (
            <View key={move.move.name} style={styles.talent}>
              <View style={styles.talentHeader}>
                <Text style={styles.talentName}>{move.move.name}</Text>
              </View>
              {move.move.url && (
                <View style={styles.talentDescriptionContainer}>
                  <FetchTalentDescription url={move.move.url} />
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.weakResContainer}>
          <Text style={styles.subTitle}>Faiblesses</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {weaknesses.map((weakness: string, index: number) => (
              <Image key={index} source={typeIcons[weakness]} style={styles.weakResIcon} />
            ))}
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Retour à la liste</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PokemonDetail;
