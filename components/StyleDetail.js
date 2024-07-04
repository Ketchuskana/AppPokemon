import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F0F0', 
  },
  card: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    // Pour Android
    elevation: 20, 
    // Pour iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 20,
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
    marginTop: 5, 
    paddingHorizontal: 10,
  },
  talent: {
    flexDirection: 'column', 
    marginBottom: 10,
    alignItems: 'center',
  },
  talentName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  talentHeader: {
    marginBottom: 5,
  },
  weakResContainer: {
    width: '100%',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
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

export const getDynamicStyles = (types) => {
  const shadowColor = types[0].color;

  return StyleSheet.create({
    card: {
      ...styles.card,
      shadowColor: shadowColor,
    },
  });
};

export default styles;
