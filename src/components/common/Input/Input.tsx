import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { styles } from './Input.styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  touched?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  touched,
  icon,
  rightIcon,
  onRightIconPress,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const hasLeftIcon = !!icon;
  const hasError = !!touched && !!error;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        
        <TextInput
          style={[
            styles.input,
            hasLeftIcon ? styles.inputWithLeftIcon : undefined,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};