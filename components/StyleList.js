import { StyleSheet } from 'react-native';

const typeColors = {
  fire: '#FFA726',
  grass: '#66BB6A',
  water: '#42A5F5',
  normal: '#A8A77A',
  bug: '#A6B91A',
  flying: '#A98FF3',
  rock: '#B6A136',
  electric: '#F8D030',
  poison: '#A33EA1',
  ground: '#E2BF65',
  fighting: '#C22E28',
  psychic: '#F95587',
  steel: '#B7B7CE',
  ice: '#96D9D6',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  fairy: '#D685AD',
  shadow: '#5A5A5A',
  unknown: '#BDBDBD',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  list: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderColor: 'transparent',
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pokemonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default styles;
