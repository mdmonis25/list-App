import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AllPeople = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://reqres.in/api/users?page=${page}&per_page=6`,
        );
        const usersData = response?.data?.data || [];
        setUsers(prevUsers => [...prevUsers, ...usersData]);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page]);

  const loadMoreUsers = () => {
    setPage(prevPage => prevPage + 1);
  };

  const toggleFavourite = async userId => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        user.isFavourite = !user.isFavourite;
      }
      return user;
    });
    setUsers(updatedUsers);
  
    // Get existing favourites from AsyncStorage
    const existingFavourites = await AsyncStorage.getItem('favouriteUsers');
    const favourites = existingFavourites ? JSON.parse(existingFavourites) : [];
  
    if (updatedUsers.find(user => user.id === userId).isFavourite) {
      // Add new favourite user
      const newFavourite = updatedUsers.find(user => user.id === userId);
      const updatedFavourites = [...favourites, newFavourite];
      await AsyncStorage.setItem('favouriteUsers', JSON.stringify(updatedFavourites));
    } else {
      // Remove the unfavourited user
      const updatedFavourites = favourites.filter(user => user.id !== userId);
      await AsyncStorage.setItem('favouriteUsers', JSON.stringify(updatedFavourites));
    }
  };
  
  const renderItem = ({ item }) => (
    <UserCard user={item} onToggleFavourite={toggleFavourite} />
  );

  const UserCard = ({ user, onToggleFavourite }) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: user.avatar }} style={styles.image} />
        <View style={styles.nameCard}>
          <Text style={styles.name}>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={() => onToggleFavourite(user.id)}>
          <Text style={styles.favourite}>{user.isFavourite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.favButton}
        onPress={() => navigation.navigate('FavouritePeople')}
      >
        <Text style={styles.favButtonText}>Go to Favourite People</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  nameCard: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  email: {
    fontSize: 15,
    color: '#777',
  },
  favButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  favButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  favourite: {
    fontSize: 21,
    alignSelf: 'center',
    marginRight:15
  },
});

export default AllPeople;
