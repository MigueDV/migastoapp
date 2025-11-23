import React from 'react';
import { View, ViewProps } from 'react-native';
import { styles } from './Card.styles';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  style,
  ...rest
}) => {
  return (
    <View style={[styles.card, styles[variant], style]} {...rest}>
      {children}
    </View>
  );
};