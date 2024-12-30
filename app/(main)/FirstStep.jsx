import { View, Text, TextInput, StyleSheet, Image, ScrollView, Keyboard, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Button from '../../components/Button';
import { hp, wp } from '../../helpers/common';
import Navigator from '../../components/Navigator';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';

const FirstStep = ({ onNext }) => {
  const [petName, setPetName] = useState('');
  const [sex, setSex] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [breedOptions, setBreedOptions] = useState([]);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [healthStatus, setHealthStatus] = useState('');
  const [id, setId] = useState('');
  const {user, setAuth} = useAuth();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const router = useRouter();
  const post = useLocalSearchParams();

  useEffect(() => {
    // Define as opções de raça conforme a espécie selecionada
    if (species === 'Cachorro') {
      setBreedOptions([
        'Labrador', 
        'Poodle', 
        'Bulldog', 
        'Pastor Alemão', 
        'Golden Retriever', 
        'Chihuahua', 
        'Beagle', 
        'Rottweiler', 
        'Shih Tzu', 
        'Dachshund', 
        'Boxer', 
        'Schnauzer', 
        'Husky Siberiano', 
        'Border Collie', 
        'Cocker Spaniel', 
        'Yorkshire Terrier',
        'Outra'
      ]);
    } else if (species === 'Gato') {
      setBreedOptions(['Siamês', 'Persa', 'Maine Coon', 'Sphynx', 'Ragdoll', 'Bengal', 'Outra']);
    } else {
      setBreedOptions([]);
    }
    // Resetando o valor da raça ao mudar a espécie
    setBreed('');
  }, [species]);

  const handleNext = () => {
    if (!petName || !sex || !species || !breed || !age || !weight || !healthStatus) {
      Alert.alert("Novo Pet", "Por favor, preencha todos os campos");
      return;
    }
    onNext({ petName, sex, species, breed, age, weight, healthStatus, id });
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    if(post && post.id) {
      setId(post.id);
      setPetName(post.pet_name);
      setSex(post.sex);
      setSpecies(post.species);
      setAge(post.age);
      setWeight(post.weight_kg);
      setHealthStatus(post.health_status);
    }

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  //Verificando se o pet já existe, se existir é uma edição
  // useEffect(()=>{
  //   if(post && post.id) {
  //     setId(post.id);
  //     setPetName(post.pet_name);
  //     setSex(post.sex);
  //     setSpecies(post.species);
  //     setAge(post.age);
  //     setWeight(post.weight_kg);
  //     setHealthStatus(post.health_status);
  //   }
  // }, [])

  return (
    <View style={{flex: 1}}>
      <ScrollView>

    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <Image style={styles.headerImage} resizeMode='contain' source={require('../../assets/images/petsRegistrationHeader.png')} />
        </View>
        {/* Linha 1 - Nome do Pet e Sexo */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Nome do Pet</Text>
            <TextInput
              value={petName}
              onChangeText={setPetName}
              placeholder="Nome do pet"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text>Sexo</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={sex} onValueChange={setSex} style={styles.picker}  >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Macho" value="Macho" />
                <Picker.Item label="Fêmea" value="Fêmea" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Linha 2 - Espécie e Raça */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Espécie</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={species} onValueChange={setSpecies} style={styles.picker}>
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Cachorro" value="Cachorro" />
                <Picker.Item label="Gato" value="Gato" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text>Raça</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={post.id ? post.breed : breed} value={breed} onValueChange={setBreed} style={styles.picker} enabled={species !== ''}>
                <Picker.Item label="Selecione" value="" />
                {breedOptions.map((breedOption, index) => (
                  <Picker.Item key={index} label={breedOption} value={breedOption} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        {/* Linha 3 - Idade e Peso (KG) */}
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text>Idade (Anos)</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Idade"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text>Peso (KG)</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              placeholder="Peso"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        {/* Linha 4 - Estado de Saúde */}
        <View style={styles.fullWidthInputContainer}>
          <Text>Estado de Saúde</Text>
          <TextInput
            value={healthStatus}
            onChangeText={setHealthStatus}
            placeholder="Vacinas em dia, castrado, etc."
            multiline
            style={styles.input}
          />
        </View>
        <View style={{marginTop: 40}}>
          <Button title="Próximo passo" onPress={handleNext} style={styles.button} />
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
  container: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  fullWidthInputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 8,
    marginTop: 5,
  },
  headerImage: {
    height: hp(25),
    width: "100%",
    alignSelf: "center",
    zIndex: 3
},
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 5,
    height: 45,
    justifyContent: "center"
  },
  picker: {
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    marginTop: 30,
  },
  navigatorWithKeyboard: {
    bottom: -1000,
    opacity: 0
  },
});

export default FirstStep;
