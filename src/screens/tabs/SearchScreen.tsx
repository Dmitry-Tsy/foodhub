import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, RootStackParamList } from '../../types';
import { RestaurantCard, Loading } from '../../components';
import { Theme } from '../../constants/theme';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchNearbyRestaurants,
  searchRestaurants,
  setUserLocation,
} from '../../store/slices/restaurantSlice';
import * as locationService from '../../services/locationService';

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Search'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: NavigationProp;
}

const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { restaurants, isLoading, userLocation } = useAppSelector(
    (state) => state.restaurants
  );
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      dispatch(setUserLocation(location));
      dispatch(fetchNearbyRestaurants({ location, radius: 5000 }));
    } catch (error: any) {
      Alert.alert(
        'Ошибка геолокации',
        'Не удалось получить ваше местоположение. Пожалуйста, разрешите доступ к геолокации.'
      );
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(searchRestaurants(searchQuery));
    } else if (userLocation) {
      dispatch(fetchNearbyRestaurants({ location: userLocation, radius: 5000 }));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLocation();
    setRefreshing(false);
  };

  const handleRestaurantPress = (restaurantId: string) => {
    navigation.navigate('RestaurantDetail', { restaurantId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Найти ресторан..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <Loading text="Загрузка ресторанов..." />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => handleRestaurantPress(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color={Theme.colors.textLight} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'Рестораны не найдены' : 'Рестораны поблизости отсутствуют'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Theme.colors.text,
    paddingVertical: Theme.spacing.md,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  emptyText: {
    fontSize: Theme.fontSize.md,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
});

export default SearchScreen;

