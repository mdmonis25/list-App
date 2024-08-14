import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AllPeople from './src/screens/AllPeople';
import FavouritePeople from './src/screens/FavouritePeople';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AllPeople" component={AllPeople} />
        <Stack.Screen name="FavouritePeople" component={FavouritePeople} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;