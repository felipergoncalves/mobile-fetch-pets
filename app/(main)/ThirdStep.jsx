import { View, Text, TextInput, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import Button from '../../components/Button';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import ScreenWrapper from '../../components/ScreenWrapper';
import { hp } from '../../helpers/common';
import Navigator from '../../components/Navigator';

const CustomCheckbox = ({ value, onValueChange }) => {
    return (
      <TouchableOpacity onPress={() => onValueChange(!value)} style={{
        width: 24,
        height: 24,
        backgroundColor: value ? 'green' : 'white',
        borderColor: 'gray',
        borderWidth: 1
      }}/>
    );
  };

const ThirdStep = ({ onNext }) => {
  const [behavior, setBehavior] = useState('');
  const [specialPreferences, setspecialPreferences] = useState('');
  const {user} = useAuth();

  const handleNext = () => {
    if (!behavior && !specialPreferences) {
      Alert.alert("Novo Pet", "Por favor, preencha todos os campos");
      return;
    }
    onNext({ 
        behavior,
        specialPreferences,
    });
    // console.log("valores do terceiro passo:", behavior, " ", specialPreferences, " ", isConfirmed, " ", user?.id);
  };

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
              <Button title="Finalizar" onPress={handleNext} />
            </View>
          </View>
        </ScreenWrapper>
      </ScrollView>
      <Navigator user={user}/>
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
})

export default ThirdStep;
