import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { Restaurant, Location } from '../types';
import { Theme } from '../constants/theme';
import { Colors } from '../constants/colors';

interface RestaurantMapProps {
  restaurants: Restaurant[];
  userLocation?: Location | null;
  onRestaurantPress: (restaurantId: string) => void;
  onClose?: () => void;
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurants,
  userLocation,
  onRestaurantPress,
  onClose,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // Определяем центр карты
  const getCenterLocation = () => {
    if (userLocation) {
      return userLocation;
    }
    if (restaurants.length > 0) {
      return restaurants[0].location;
    }
    return { latitude: 55.7558, longitude: 37.6173 }; // Москва
  };

  const center = getCenterLocation();

  // Генерируем HTML для Google Maps с маркерами
  const generateMapHTML = () => {
    const markers = restaurants.map((restaurant, index) => `
      new google.maps.Marker({
        position: { lat: ${restaurant.location.latitude}, lng: ${restaurant.location.longitude} },
        map: map,
        title: "${restaurant.name.replace(/"/g, '\\"')}",
        label: "${index + 1}",
        animation: google.maps.Animation.DROP
      }).addListener('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'restaurantClick',
          restaurantId: '${restaurant.id}'
        }));
      });
    `).join('\n');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; }
            html, body, #map { height: 100%; width: 100%; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            function initMap() {
              const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: ${center.latitude}, lng: ${center.longitude} },
                zoom: 13,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
              });

              ${userLocation ? `
              new google.maps.Marker({
                position: { lat: ${userLocation.latitude}, lng: ${userLocation.longitude} },
                map: map,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 8,
                  fillColor: '#4285F4',
                  fillOpacity: 1,
                  strokeColor: '#fff',
                  strokeWeight: 2
                },
                title: 'Вы здесь'
              });
              ` : ''}

              ${markers}
            }
          </script>
          <script async defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCnveR2zXFc-UMPCvhD49A51ayEHG99W98&callback=initMap">
          </script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'restaurantClick') {
        onRestaurantPress(data.restaurantId);
      }
    } catch (error) {
      console.error('Error parsing map message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: generateMapHTML() }}
        style={styles.map}
        onMessage={handleMessage}
      />

      {/* Кнопка закрытия */}
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
      )}

      {/* Счетчик ресторанов */}
      <View style={styles.counterBadge}>
        <Ionicons name="restaurant" size={16} color={Colors.background} />
        <Text style={styles.counterText}>{restaurants.length}</Text>
      </View>

      {/* Легенда */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.userDot} />
          <Text style={styles.legendText}>Вы</Text>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="restaurant" size={16} color={Colors.primary} />
          <Text style={styles.legendText}>Рестораны</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.round,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.lg,
  },
  counterBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.round,
    gap: 4,
    ...Theme.shadows.lg,
  },
  counterText: {
    color: Colors.background,
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.bold,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.background,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    flexDirection: 'row',
    gap: Theme.spacing.md,
    ...Theme.shadows.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: Theme.fontSize.sm,
    color: Colors.text,
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#fff',
  },
});

