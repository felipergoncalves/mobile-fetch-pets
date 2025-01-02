import { View, Text, TextInput, ScrollView, StyleSheet, Image, Keyboard, Alert } from 'react-native';
import Button from '../../components/Button';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp } from '../../helpers/common';
import Navigator from '../../components/Navigator';
import { useLocalSearchParams } from 'expo-router';

const ThirdStep = ({ onNext, isLoading = false }) => {
  const [behavior, setBehavior] = useState('');
  const [specialPreferences, setspecialPreferences] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const {user} = useAuth();
  const { post } = useLocalSearchParams();
  const postToEdit = post ? JSON.parse(post) : {};

  const handleNext = () => {
    if (!behavior && !specialPreferences) {
      Alert.alert("Novo Pet", "Por favor, preencha todos os campos");
      return;
    }
    onNext({ 
        behavior,
        specialPreferences,
    });
  };

  //Verificando se o pet já existe, se existir é uma edição
  useEffect(()=>{
    if(postToEdit && postToEdit.id) {
      setBehavior(postToEdit.behavior);
      setspecialPreferences(postToEdit.special_preferences);
    }
  }, [])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
}, []);

  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <ScreenWrapper>
          <View style={{ padding: 20}}>
            <View>
              <Image style={styles.headerImage} resizeMode='contain' source={require('../../assets/images/petsRegistrationHeader.png')} />
            </View>
            <View style={{flex: 1}}>
              <Text>Comportamento</Text>
              <TextInput 
                value={behavior}
                onChangeText={setBehavior}
                placeholder="Comportamento"
                multiline
                style={styles.input}v 
              />
            </View>
            <View style={{flex: 1, marginTop: 15}}>
              <Text>Preferências ou Cuidados Especiais</Text>
              <TextInput
                value={specialPreferences}
                onChangeText={setspecialPreferences}
                placeholder="Preferências ou cuidados especiais"
                multiline
                style={styles.input}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Button  title="Finalizar" onPress={handleNext} loading={isLoading} />
            </View>
          </View>
        </ScreenWrapper>
      </ScrollView>
      <View style={keyboardVisible && styles.navigatorWithKeyboard}>
        <Navigator user={user}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 8,
    marginTop: 5,
  },
  headerImage: {
    height: hp(20),
    width: "100%",
    alignSelf: "center",
    zIndex: 3
  },
  navigatorWithKeyboard: {
    bottom: -1000,
    opacity: 0
  },
})

export default ThirdStep;
