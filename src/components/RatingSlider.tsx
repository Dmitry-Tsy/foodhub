import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Theme } from '../constants/theme';
import { getRatingColor } from '../constants/colors';

interface RatingSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  disabled?: boolean;
}

export const RatingSlider: React.FC<RatingSliderProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleValueChange = (newValue: number) => {
    const rounded = Math.round(newValue * 10) / 10;
    setCurrentValue(rounded);
    onValueChange(rounded);
  };

  const ratingColor = getRatingColor(currentValue);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Рейтинг блюда</Text>
        <Text style={[styles.ratingText, { color: ratingColor }]}>
          {currentValue.toFixed(1)}
        </Text>
      </View>
      
      <Slider
        style={styles.slider}
        value={currentValue}
        onValueChange={handleValueChange}
        minimumValue={0}
        maximumValue={10}
        step={0.1}
        minimumTrackTintColor={ratingColor}
        maximumTrackTintColor={Theme.colors.borderLight}
        thumbTintColor={ratingColor}
        disabled={disabled}
      />
      
      <View style={styles.scaleContainer}>
        <Text style={styles.scaleText}>0.0</Text>
        <Text style={styles.scaleText}>5.0</Text>
        <Text style={styles.scaleText}>10.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  label: {
    fontSize: Theme.fontSize.md,
    fontWeight: Theme.fontWeight.medium,
    color: Theme.colors.text,
  },
  ratingText: {
    fontSize: Theme.fontSize.xxl,
    fontWeight: Theme.fontWeight.bold,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xs,
  },
  scaleText: {
    fontSize: Theme.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
});

