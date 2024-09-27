import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, FlatList, Image, TouchableOpacity, ScrollView, Button } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const api_key = '2bd8e334e4da4462b704cf64099197e4';
const windowWidth = Dimensions.get('window').width;
const RecipeSearch = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);

  const searchRecipes = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchTerm}&number=10&apiKey=${api_key}`
      );
      setRecipes(response.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}>
      <View style={styles.recipeCard}>
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        <Text style={styles.recipeTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Finder</Text>
      <TextInput
        style={styles.input}
        placeholder="Search for a recipe"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Search" onPress={searchRecipes} />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipe}
        contentContainerStyle={styles.recipeList}
      />
    </View>
  );
};

const RecipeDetails = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${api_key}`
        );
        setRecipeDetails(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipeDetails();
  }, [recipeId]);

  if (!recipeDetails) {
    return <Text>Loading...</Text>;
  }
  const formatInstructions = (instructions) => {
    if (instructions) {
      // Replace newlines with <br /> to format as HTML
      return instructions.replace(/\n/g, '<br />');
    }
    return instructions;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{recipeDetails.title}</Text>
      <Text style={styles.subTitle}>Ingredients:</Text>
      <FlatList
        data={recipeDetails.extendedIngredients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text style={styles.ingredient}>{item.original}</Text>}
      />
      <Text style={styles.subTitle}>Instructions:</Text>
      <RenderHTML
  contentWidth={windowWidth}
  source={{ html: formatInstructions(recipeDetails.instructions) }}
/>

    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecipeSearch">
        <Stack.Screen name="RecipeSearch" component={RecipeSearch} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  recipeList: {
    paddingBottom: 16,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    borderRadius: 5,
  },
  recipeImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default App;
