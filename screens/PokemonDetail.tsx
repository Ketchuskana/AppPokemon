import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import FetchTalentDescription from '../components/FetchTalentDescription';
import styles, { getDynamicStyles } from '../components/StyleDetail';
import { typeColors, typeIcons } from '../components/pokemonTypes'; 


type PokemonDetailProps = {
  pokemonName: string;
  onBack: () => void;
};

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonName, onBack }) => {
  const [pokemonDetail, setPokemonDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<string[]>([]);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);

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
        const speciesUrl: string = data.species.url;
        fetch(speciesUrl)
          .then(response => response.json())
          .then(speciesData => {
            const evolutionChainUrl: string = speciesData.evolution_chain.url;
            fetch(evolutionChainUrl)
              .then(response => response.json())
              .then(evolutionChainData => {
                const chain = parseEvolutionChain(evolutionChainData.chain, pokemonName);
                setEvolutionChain(chain);
                setLoading(false);
              })
              .catch(error => {
                console.error('Failed to fetch evolution chain', error);
                setError('Failed to load evolution chain');
                setLoading(false);
              });
          })
          .catch(error => {
            console.error('Failed to fetch species details', error);
            setError('Failed to load species details');
            setLoading(false);
          });

        const typesUrls = data.types.map((type: any) => type.type.url);
        Promise.all(typesUrls.map(url => fetch(url).then(response => response.json())))
          .then(typesData => {
            const weaknesses = typesData.flatMap((typeData: any) => {
              return typeData.damage_relations.double_damage_from.map((weakness: any) => weakness.name);
            });
            setWeaknesses(weaknesses);
          })
          .catch(error => {
            console.error('Failed to fetch weaknesses', error);
            setError('Failed to load weaknesses');
          });
      })
      .catch(error => {
        console.error('Failed to fetch Pokemon details', error);
        setError('Failed to load Pokemon details');
        setLoading(false);
      });
  }, [pokemonName]);

  const parseEvolutionChain = (chain: any, currentPokemonName: string): string[] => {
    const result: string[] = [];
    traverseChain(chain, currentPokemonName, result);
    return result;
  };

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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const dynamicStyles = getDynamicStyles(pokemonDetail.types.map((type: any) => ({
    name: type.type.name,
    color: typeColors[type.type.name] || typeColors.unknown,
  })));

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.card, dynamicStyles.card]}>
        <View style={styles.header}>
          <Text style={styles.name}>{pokemonDetail.name.charAt(0).toUpperCase() + pokemonDetail.name.slice(1)}</Text>
          <Text style={styles.hp}>PV {pokemonDetail.stats.find((stat: any) => stat.stat.name === 'hp').base_stat}</Text>
        </View>
        <View style={styles.imageContainer}>
          <Text style={styles.imageInfo}>Niveau: <Text style={styles.imageInfo}>{pokemonDetail.base_experience}</Text></Text>
          <Text style={styles.imageInfo}>Evolution: </Text>
          {evolutionChain.length > 0 ? (
            <Text style={styles.imageInfo}>
              {evolutionChain.map((evolutionName, index) => (
                <Text key={index}>{evolutionName}</Text>
              ))}
            </Text>
          ) : (
            <Text style={styles.imageInfo}>No further evolutions</Text>
          )}
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
          <Text style={styles.subTitle}>Weakness</Text>
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
