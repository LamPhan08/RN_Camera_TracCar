import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface BackButtonProps {
  style?: any; // Define style prop type
}

const BackButton: React.FC<BackButtonProps> = ({style}) => {
  // Use style prop
  const navigation = useNavigation();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={32} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 64,
    width: 64,
    elevation: 15,
    zIndex: 15,
    top: 5,
    left: 5,
    borderRadius: 10,
    padding: 10,
  },
});

export default BackButton;