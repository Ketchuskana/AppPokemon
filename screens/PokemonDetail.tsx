import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import FetchTalentDescription from '../components/FetchTalentDescription';


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
          <Text style={styles.subTitle}>Faiblesse</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {weaknesses.map((weakness: string, index: number) => (
              <Image key={index} source={typeIcons[weakness]} style={styles.weakResIcon} />
            ))}
          </View>
          <Text style={styles.subTitle}>Résistance</Text>
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

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderColor: '#643127',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  hp: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  imageInfo: {
    fontSize: 10,
    color: 'grey',
  },
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
  },
  typeIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  typeText: {
    fontSize: 16,
    color: 'white',
  },
  talentsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  talentDescriptionContainer: {
    maxWidth: 50,  
    overflow: 'hidden',
  },
  talent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },  
  talentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  talentHeader: {
    marginBottom: 5,   // Espacement sous le titre du talent
  },
  weakResContainer: {
    width: '100%',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  weakResIcon: {
    width: 20,
    height: 20,
    margin: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PokemonDetail;
