import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import FetchTalentDescription from '../components/FetchTalentDescription';
import styles from '../components/StyleDetail';

type PokemonDetailProps = {
  pokemonName: string;
  onBack: () => void;
};

const typeColors: { [key: string]: string } = {
  fire: '#FFA726',
  grass: '#66BB6A',
  water: '#42A5F5',
  normal: '#212121',
  bug: '#AB47BC',
  flying: '#E3F2FD',
  rock: '#795548',
  electric: '#FFEB3B',
  poison: '#9C27B0',
  default: '#BDBDBD',
};

const typeIcons: { [key: string]: any } = {
  fire: require('../assets/image/feu.png'),
  grass: require('../assets/image/feuille.png'),
  water: require('../assets/image/eau.png'),
  normal: require('../assets/image/swords.png'),
  bug: require('../assets/image/insecte.png'),
  flying: require('../assets/image/ailes.png'),
  rock: require('../assets/image/pierre.png'),
  electric: require('../assets/image/éclaire.png'),
  poison: require('../assets/image/poison.png'),
};

const typeWeaknesses: { [key: string]: string[] } = {
  fire: ['water', 'rock', 'fire'],
  grass: ['fire', 'bug', 'flying'],
  water: ['grass', 'electric'],
  normal: ['fighting'],
  bug: ['fire', 'flying', 'rock'],
};

const typeResistances: { [key: string]: string[] } = {
  fire: ['fire', 'grass', 'bug'],
  grass: ['water', 'grass', 'electric'],
  water: ['fire', 'water', 'ice'],
  normal: [],
  bug: ['grass', 'fighting', 'ground'],
};

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonName, onBack }) => {
  const [pokemonDetail, setPokemonDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPokemonDetail(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to load Pokemon details');
        setLoading(false);
      });
  }, [pokemonName]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const weaknesses = pokemonDetail.types
    .map((type: any) => typeWeaknesses[type.type.name] || [])
    .flat();

  const resistances = pokemonDetail.types
    .map((type: any) => typeResistances[type.type.name] || [])
    .flat();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.slice(1)}</Text>
          <Text style={styles.hp}>PV {pokemonDetail.stats.find((stat: any) => stat.stat.name === 'hp').base_stat}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.imageInfo}>Niveau: {pokemonDetail.base_experience} Evolution: {pokemonDetail.species.name}</Text>
          <Image
            source={{ uri: pokemonDetail.sprites.front_default }}
            style={styles.image}
          />
          <Text style={styles.imageInfo}>Taille: {pokemonDetail.height / 10} m Poids: {pokemonDetail.weight / 10} kg</Text>
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
                <Text style={styles.talentName}>Talent: {move.move.name}</Text>
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
          <Text style={styles.subTitle}>Weakness</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {weaknesses.map((weakness: string, index: number) => (
              <Image key={index} source={typeIcons[weakness]} style={styles.weakResIcon} />
            ))}
          </View>
          <Text style={styles.subTitle}>Resistance</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {resistances.map((resistance: string, index: number) => (
              <Image key={index} source={typeIcons[resistance]} style={styles.weakResIcon} />
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
