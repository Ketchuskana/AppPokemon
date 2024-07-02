import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FetchTalentDescription: React.FC<{ url: string }> = ({ url }) => {
  const [talentDescription, setTalentDescription] = useState<string | null>(null);

  useEffect(() => {
    fetchTalentDescription(url);
  }, [url]);

  const fetchTalentDescription = (url: string) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const description = data.effect_entries.find((entry: any) => entry.language.name === 'en');
        setTalentDescription(description ? description.short_effect : 'No description available');
      })
      .catch(error => {
        console.error('Failed to fetch talent description:', error);
        setTalentDescription('Failed to load talent description');
      });
  };

  if (!talentDescription) {
    return <Text style={styles.talentDescription}>Loading talent description...</Text>;
  }

  return <Text style={styles.talentDescription}>{talentDescription}</Text>;
};

const styles = StyleSheet.create({
  talentDescription: {
    fontSize: 8,
    color: 'grey',
  },
});

export default FetchTalentDescription;
