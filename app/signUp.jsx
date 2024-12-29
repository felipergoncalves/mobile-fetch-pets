import React, { useState, useEffect } from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform, Alert, Image } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { theme } from '../constants/theme'
import { useRouter } from 'expo-router'
import { signUp, getAdressInformation, updateUser } from '../services/userService'
import ScreenWrapper from '../components/ScreenWrapper'
import BackButton from '../components/BackButton'
import Input from '../components/Input'
import Button from '../components/Button'
import PhoneInput from '../components/PhoneInput'
import CustomSelect from '../components/CustomSelect'
import CustomDatePicker from '../components/CustomDataPicker'
import LoadingScreen from '../components/LoadingScreen'
import Checkbox from '../components/CheckBox'
import { useAuth } from '../contexts/AuthContext'

import { useLocalSearchParams } from 'expo-router';

const signUpPage = () => {
    // Variables
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        birthDate: "",
        gender: "",
        address: "",
        stateAndCity: "",
        zip: "",
        image: "",
        politycs: false,
        houseNumber: 0
    });
    const { isUpdate } = useLocalSearchParams();
    const [ image, setNewImage ] = useState(null);
    const [ houseNumber, setHouseNumber ] = useState('');
    
    const isUpdateBoolean = isUpdate === 'true';

    useEffect(() => {

        if (isUpdateBoolean) {
            setNewUser(user?.user);
            setHouseNumber(user?.user.houseNumber);
        }
    }, [isUpdate]);

    // Functions
    const handleStep = (newStep) => {
        if (isUpdateBoolean) {
            if (step === 1) {
                if(!newUser.password) {
                    newUser.password = '';
                    newUser.confirmPassword = '';
                }

                if (newUser.password) {
                    if (newUser.password.length < 6) {
                        Alert.alert("Cadastro", "A senha deve ter pelo menos 6 dígitos!");
                        return;
                    }

                    if (newUser.password !== newUser.confirmPassword) {
                        Alert.alert("Cadastro", "As senhas não coincidem!");
                        return;
                    }
                }
            }
        return setStep(newStep);    
        }
        if (step === 1) {
            if (newUser.name == '' || newUser.email == '' || newUser.password == '' || newUser.confirmPassword == '' || newUser.phone == '') {
                Alert.alert("Cadastro!", "Por favor, preencha todos os campos!");
                return;
            }

            if (newUser.password.length < 6 && !isUpdateBoolean) {
                Alert.alert("Cadastro", "A senha deve ter pelo menos 6 dígitos!");
                return;
            }

            if (newUser.password !== newUser.confirmPassword) {
                Alert.alert("Cadastro", "As senhas não coincidem!");
                return;
            }
        }
        if (step === 2) {
            if (newUser.gender == '' || newUser.birthDate == '' || newUser.stateAndCity == '' || newUser.address == '' || newUser.zip == '') {
                Alert.alert("Por favor, preencha todos os campos!");
                return;
            }
        }
        if (step === 3) {
            if (newUser.politycs == false) {
                Alert.alert("Por favor, aceite os termos de uso e a política de privacidade!");
                return;
            }
        }
        setStep(newStep);
    }

    const selectImage = async () => {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert('Desculpe, precisamos da permissão para acessar as fotos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0];
            const filename = uri.substring(uri.lastIndexOf('/') + 1);
            const extend = filename.split('.')[1];

            setNewImage({ uri: uri, name: filename, type: `image/${extend}` });
        }
    };

    const onSubmit = async (option) => {
        setLoading(true);
        let res = null;

        if (option === 'update') {
            const oldImagePath = user?.user.image;

            Object.keys(newUser).forEach(key => {
                if (newUser[key]) {
                    user.user[key] = newUser[key];
                }
            });

            user.user.houseNumber = houseNumber;

            res = await updateUser(user.user, oldImagePath, image, user.token);
        }

        if (option === 'signUp') {
            newUser.houseNumber = houseNumber;
            res = await signUp(newUser, image);
        }

        if (!res.success) {
            Alert("Erro ao cadastrar!", res.msg);
            setLoading(false);
            setStep(1);
            return;
        }

        setLoading(false);
        setStep(4);
    }

    const getCep = async (zip) => {
        if (zip.length < 8) {
            return;
        }
        setLoading(true);
        const res = await getAdressInformation(zip);

        setLoading(false);
        
        if (res.success) {
            setNewUser({ ...newUser, stateAndCity: res.data.estado + "/" + res.data.localidade, address: res.data.logradouro, zip: zip });
        }
    }

    return (
        <ScreenWrapper bg={'white'}>
            <View style={styles.container}>
                {/* Loading Screen */}
                {loading && <LoadingScreen />}
                {/* Titulo - TOP */}
                <View style={styles.titleContainer}>
                    <BackButton style={styles.buttonTitle} router={router} />
                    <Text style={styles.title}>{isUpdateBoolean ? 'Editar Perfil' : 'Cadastro'}</Text>
                </View>
                {/* Inputs e outros */}
                {step === 1 && (
                    <>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardAvoidingView}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // ajuste conforme necessário
                        >
                            <ScrollView
                                contentContainerStyle={styles.scrollViewContainer}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={[styles.containerView, { marginTop: 10 }]}>
                                    {/* Nome */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Nome
                                    </Text>
                                    <Input

                                        onChangeText={(text) => setNewUser({ ...newUser, name: text })}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite seu Nome Completo"
                                        value={newUser.name}
                                    />
                                    {/* Phone */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Número de Telefone
                                    </Text>
                                    <PhoneInput
                                        onCountryCodeChange={(value) => setNewUser({ ...newUser, phone: value })}
                                        phoneValue={isUpdate ? user?.user.phoneNumber : newUser.phoneNumber}
                                        onPhoneChange={(value) => setNewUser({ ...newUser, phoneNumber: value })}
                                        style={{ marginBottom: 10 }}
                                    />
                                    {/* Email */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        E-mail
                                    </Text>
                                    <Input
                                        onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite seu E-mail"
                                        keyboardType="email-address"
                                        value={newUser.email}
                                    />
                                    {/* Senha */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Senha
                                    </Text>
                                    <Text style={styles.passwordCriteria}>
                                        Senha deve ter pelo menos 6 dígitos
                                    </Text>
                                    <Input
                                        secureTextEntry
                                        onChangeText={(text) => setNewUser({ ...newUser, password: text })}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite sua senha"
                                    />
                                    {/* Confirme a Senha */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Confirme a senha
                                    </Text>
                                    <Input
                                        secureTextEntry
                                        onChangeText={(text) => setNewUser({ ...newUser, confirmPassword: text })}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite sua senha novamente"
                                    />
                                </View>
                                <Button title={"Próximo Passo"} buttonStyle={styles.textButton} onPress={() => handleStep(2)} />
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </>
                )
                }
                {step === 2 && (
                    <>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardAvoidingView}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // ajuste conforme necessário
                        >
                            <ScrollView
                                contentContainerStyle={styles.scrollViewContainer}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={[styles.containerView, { marginTop: 10 }]}>
                                    {/* Genero */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Gênero
                                    </Text>
                                    <CustomSelect
                                        options={["Masculino", "Feminino", "Outro", "Prefiro não dizer"]}
                                        placeholder="Selecione uma opção"
                                        onSelect={(value) => setNewUser({ ...newUser, gender: value })}
                                        value={isUpdate ? user?.user.gender : newUser.gender}
                                        style={{ marginBottom: 10 }}
                                    />

                                    {/* Data de Nascimento */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Data de Nascimento
                                    </Text>
                                    <CustomDatePicker
                                        style={{ marginBottom: 10 }}
                                        placeholder='Selecione sua data de nascimento'
                                        onDateChange={(value) => setNewUser({ ...newUser, birthDate: value })}
                                        value={newUser.birthDate}
                                    />

                                    {/* Estado / Cidade */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Estado/Cidade
                                    </Text>
                                    <Input
                                        onChangeText={async (text) => setNewUser({ ...newUser, stateAndCity: text })}
                                        value={newUser.stateAndCity}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite seu Estado/Cidade"
                                    />
                                    {/* Endereço */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Endereço
                                    </Text>
                                    <Input
                                        onChangeText={(text) => setNewUser({ ...newUser, address: text })}
                                        containerStyle={{ marginBottom: 10 }}
                                        value={newUser.address}
                                        placeholder="Digite sua rua"
                                    />
                                    {/* CEP */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        CEP
                                    </Text>
                                    <Input
                                        onChangeText={async (text) => setNewUser({ ...newUser, zip: text })}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite seu CEP"
                                        keyboardType="number-pad"
                                        value={newUser.zip}
                                    />
                                    {/* Numero */}
                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        Número
                                    </Text>
                                    <Input
                                        onChangeText={(text) => {
                                            setHouseNumber(text);
                                        }}
                                        containerStyle={{ marginBottom: 10 }}
                                        placeholder="Digite número da sua casa ou apartamento"
                                        keyboardType="number-pad"
                                        value={houseNumber}
                                    />
                                </View>
                                <Button title={"Próximo Passo"} buttonStyle={styles.textButton} onPress={() => handleStep(3)} />
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </>
                )}
                {step === 3 && (
                    <>
                        <View style={[styles.containerView, { marginTop: 10 }]}>
                            {/* Foto */}

                            <Text style={styles.subtitle}>
                                {isUpdateBoolean ? 'Atualize sua foto de perfil!' : 'Ei, que tal colocar uma foto no seu perfil?(Opcional)'}

                            </Text>

                            <View style={styles.imageView}>
                                <TouchableOpacity onPress={async () => {
                                    await selectImage();
                                }}>
                                    <Image
                                        style={styles.logoImage}
                                        source={image?.uri ? { uri: image.uri } : require('../assets/images/UploadFoto.png')
                                        }
                                    />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.subtitle, { marginTop: 20 }]}>
                                Tamanho máximo de 5MB
                            </Text>

                            {!isUpdateBoolean && 
                                <Checkbox
                                    label="Eu li e concordo com os Termos de Uso e a Política de Privacidade."
                                    checked={newUser.politycs}
                                    onChange={(value) => setNewUser({ ...newUser, politycs: value })}
                                />
                            }

                        </View>
                        { isUpdateBoolean ? (
                            <Button title={"Atualizar Perfil"} buttonStyle={styles.textButton} onPress={async () => await onSubmit('update')} />
                        )
                        :
                        (
                            <Button title={"Finalizar Cadastro"} buttonStyle={styles.textButton} onPress={async () => await onSubmit('signUp')} />
                        )}
                    </>
                )}
                {step === 4 && (
                    <>
                        <View style={styles.containerView}>
                            <Text style={styles.subtitle}>
                                {isUpdateBoolean ? 'Atualização feita com sucesso!': 'Seu cadastro foi concluído com sucesso! Bem-vindo(a)!'}
                            </Text>
                            <Image style={styles.logoImage} resizeMode='contain' source={require('../assets/images/CadastroSuccess.png')} />

                        </View>
                        {isUpdateBoolean ? (
                            <Button title={"Voltar"} buttonStyle={styles.textButton} onPress={() => router.push('settings')} />
                        ) : (
                            <Button title={"Voltar ao Login"} buttonStyle={styles.textButton} onPress={() => router.push('login')} />
                        )}
                    </>
                )}
            </View>
        </ScreenWrapper>
    )
}

export default signUpPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    titleContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
    },
    buttonTitle: {
        position: "relative",
        right: 0,
        marginTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
        width: "100%",
    },
    keyboardAvoidingView: {
        flex: 1,
        width: "100%",
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: "center", // Centraliza os itens quando o teclado não está aberto
        width: "100%",
    },
    textButton: {
        color: "#fff",
        fontSize: 18,
        width: "100%",
        marginBottom: 50,
    },
    containerView: {
        flex: 1,
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    logoImage: {
        height: '100%',
        width: '100%',
        alignSelf: "center",
        resizeMode: 'cover',
        zIndex: 3,
        borderRadius: theme.radius.sm
    },
    imageView: {
        width: "100%",
        height: "60%",
        backgroundColor: "#3198F4",
        borderRadius: theme.radius.sm
    },
    passwordCriteria: {
        width: '100%',
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '400',
        color: '#a3a3a3',
    }
})