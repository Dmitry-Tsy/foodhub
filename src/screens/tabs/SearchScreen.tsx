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
import { RestaurantCard, Loading, RestaurantMap } from '../../components';
import { Theme } from '../../constants/theme';
import { Colors } from '../../constants/colors';
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
  const { restaurants, isLoading, userLocation, error } = useAppSelector(
    (state) => state.restaurants
  );
  
  // Логируем состояние для дебага
  React.useEffect(() => {
    console.log('📊 SearchScreen state:', { 
      restaurantsCount: restaurants.length, 
      isLoading, 
      hasLocation: !!userLocation,
      error 
    });
  }, [restaurants, isLoading, userLocation, error]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showMap, setShowMap] = useState(false); // Переключение между списком и картой

  useEffect(() => {
    console.log('SearchScreen mounted, loading location...');
    loadLocation();
  }, []);

  const loadLocation = async () => {
    console.log('🔍 Starting loadLocation...');
    try {
      console.log('📍 Requesting current location...');
      const location = await locationService.getCurrentLocation();
      console.log('✅ Location received:', location);
      dispatch(setUserLocation(location));
      console.log('🔄 Fetching nearby restaurants...');
      const result = await dispatch(fetchNearbyRestaurants({ location, radius: 5000 })).unwrap();
      console.log('✅ Restaurants loaded:', result.length);
    } catch (error: any) {
      // Fallback: показываем рестораны с mock координатами (Москва)
      console.log('⚠️ Геолокация недоступна, используем mock координаты:', error.message);
      const mockLocation = {
        latitude: 55.7558,  // Москва
        longitude: 37.6173,
      };
      dispatch(setUserLocation(mockLocation));
      console.log('🔄 Fetching restaurants with mock location...');
      try {
        const result = await dispatch(fetchNearbyRestaurants({ location: mockLocation, radius: 50000 })).unwrap();
        console.log('✅ Mock restaurants loaded:', result.length);
      } catch (fetchError: any) {
        console.error('❌ Failed to load mock restaurants:', fetchError);
      }
      
      Alert.alert(
        'Геолокация недоступна',
        'Показаны рестораны в Москве. Для поиска рядом с вами разрешите доступ к геолокации в настройках.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Передаем location для Google Places поиска
      const searchLocation = userLocation || {
        latitude: 55.7558,
        longitude: 37.6173,
      };
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
      {/* Debug info */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Restaurants: {restaurants.length} | Loading: {isLoading ? 'YES' : 'NO'} | Location: {userLocation ? 'YES' : 'NO'}
          </Text>
        </View>
      )}
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
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
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.filterButton, showMap && styles.filterButtonActive]}
          onPress={() => setShowMap(!showMap)}
        >
          <Ionicons
            name={showMap ? 'list' : 'map'}
            size={24}
            color={showMap ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <Loading text="Загрузка ресторанов..." />
      ) : showMap ? (
        <RestaurantMap
          restaurants={restaurants}
          userLocation={userLocation}
          onRestaurantPress={handleRestaurantPress}
        />
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
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color={Colors.textLight} />
              <Text style={styles.emptyText}>
                {searchQuery ? 'Рестораны не найдены' : 'Рестораны поблизости отсутствуют'}
              </Text>
              {!searchQuery && (
                <>
                  <TouchableOpacity
                    style={styles.loadMockButton}
                    onPress={loadLocation}
                  >
                    <Text style={styles.loadMockButtonText}>
                      Загрузить рестораны
                    </Text>
                  </TouchableOpacity>
                  {error && (
                    <Text style={styles.errorText}>
                      Ошибка: {error}
                    </Text>
                  )}
                </>
              )}
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Theme.fontSize.md,
    color: Colors.text,
    paddingVertical: Theme.spacing.md,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: `${Colors.primary}20`,
    borderWidth: 2,
    borderColor: Colors.primary,
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
    color: Colors.textSecondary,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  loadMockButton: {
    marginTop: Theme.spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  loadMockButtonText: {
    color: Colors.background,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.semibold,
  },
  errorText: {
    color: Colors.error,
    fontSize: Theme.fontSize.sm,
    marginTop: Theme.spacing.md,
    textAlign: 'center',
  },
  debugInfo: {
    backgroundColor: '#000',
    padding: 4,
    opacity: 0.8,
  },
  debugText: {
    color: '#0f0',
    fontSize: 10,
    fontFamily: 'monospace',
  },
});

export default SearchScreen;

