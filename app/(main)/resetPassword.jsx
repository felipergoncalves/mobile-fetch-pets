import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Platform, Text, TextInput, StyleSheet, Alert, Image, Keyboard, ScrollView } from 'react-native';
import { resetPassword, sendResetPassword, verifyCode } from '../../services/userService';
import { useRouter } from 'expo-router'
import { hp, wp } from '../../helpers/common';
import ScreenWrapper from '../../components/ScreenWrapper';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import LoadingScreen from '../../components/LoadingScreen';

const ResetPassword = () => {

    const inputs = [];

    const router = useRouter();
    
    const [user, setUser] = useState(null);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [title, setTitle] = useState('Esqueceu a senha?');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async () => {
        // Lógica para enviar e-mail
        if (!email) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }
        setLoading(true);
        const res = await sendResetPassword(email);

        if (!res.success) {
            Alert.alert('Erro', 'Não foi possível enviar o e-mail.');
            setLoading(false);

            return
        }

        Alert.alert('E-mail enviado!', 'Verifique sua caixa de entrada para o código.');

        setStep(2);
        setTitle('Verificar Código');

        setLoading(false);
    };

    const handleVerifyCode = async () => {
        // Lógica para verificar o código

        if (otp.some((digit) => digit === '')) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos do código.');
            return;
        }
        
        const code = otp.join('');

        setLoading(true);

        const res = await verifyCode(email, code);
        
        if (!res.success) {
            Alert.alert('Erro', 'Código inválido.');
            setLoading(false);
            return;
        }

        setLoading(false);
        setUser(res.user);

        setStep(3);
        setTitle('Redefinir Senha');
    };

    const handleResetPassword = async () => {
        // Lógica para redefinir a senha
        if (!newPassword || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, insira uma nova senha.');
            return;
        }

        if (newPassword !== confirmPassword)
        {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return
        }

        if (newPassword.length < 6) {
            Alert.alert('Erro', 'A senha deve ter no mínimo 6 caracteres.');
            return;
        }

        setLoading(true);
        const res = await resetPassword(email, newPassword, user);
        
        if (!res.success) {
            Alert.alert('Erro', 'Não foi possível redefinir a senha.');
            setLoading(false);
            return;
        }

        setLoading(false);
        setTitle('Senha Alterada!');
        setStep(4);
    };

    const handleChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text == '') {
          if (index > 0) {
            inputs[index - 1].focus();
          }
        }

        // Passa o foco automaticamente para o próximo campo se houver um valor digitado
        if (text && index < 5) {
          inputs[index + 1].focus();
        }

        if (newOtp.every((digit) => digit !== '')) {
            Keyboard.dismiss();
        }

    };

    return (
        <ScreenWrapper bg={'white'}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <BackButton style={styles.buttonTitle} router={router}/>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {loading && <LoadingScreen />}
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
                                <View style={styles.containerView}>
                                    <Text style={styles.subtitle}>
                                        Não se preocupe! Insira o endereço de e-mail associado à sua conta.
                                    </Text>

                                    <Image style={styles.image} resizeMode='contain' source={require('../../assets/images/EsqueciSenha.png')} />

                                    <Text style={{ width: '100%', marginBottom: 5, fontWeight: '600' }}>
                                        E-mail
                                    </Text>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        style={styles.input}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <Button title={"Enviar Código"} buttonStyle={styles.textButton} onPress={handleSendEmail} />
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </>
                )}

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
                                <View style={styles.containerView}>
                                    <Text style={styles.subtitle}>
                                        Um código foi enviado para o seu e-mail. Insira o código abaixo para continuar.
                                    </Text>

                                    <Image style={styles.image} resizeMode='contain' source={require('../../assets/images/VerificarCodigo.png')} />

                                    <View style={styles.otpContainer}>
                                        {otp.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                ref={(input) => (inputs[index] = input)}
                                                style={styles.otpInput}
                                                value={digit}
                                                onChangeText={(text) => handleChange(text, index)}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                            />
                                        ))}
                                    </View>

                                    <Button title="Verificar Código" buttonStyle={styles.textButton} onPress={handleVerifyCode} />
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </>
                )}

                {step === 3 && (
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
                                <View style={styles.containerView}>
                                    <Text style={styles.subtitle}>
                                    Por favor, insira sua nova senha abaixo. Certifique-se de que ela atenda aos critérios de segurança para garantir a proteção da sua conta
                                    </Text>
                                    <Text style={{ width: '100%', marginBottom: 5, marginTop: 20, fontWeight: '600' }}>
                                        Senha
                                    </Text>
                                    <TextInput
                                        secureTextEntry
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        style={styles.input}
                                    />
                                    <Text style={{ width: '100%', marginBottom: 5, marginTop: 20, fontWeight: '600' }}>
                                    Confirme a senha
                                    </Text>
                                    <TextInput
                                        secureTextEntry
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        style={styles.input}
                                    />
                                    <Button title="Redefinir Senha" buttonStyle={[styles.textButton, {marginTop: 14}]} onPress={handleResetPassword} />
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </>
                )}

                {step === 4 && (
                    <>
                        <View style={styles.containerView}>
                            <Text style={styles.subtitle}>
                            Sua senha foi alterada com sucesso! Agora você pode acessar sua conta usando sua nova senha. Se você não fez essa alteração, entre em contato com o suporte imediatamente.
                            </Text>
                            <Image style={styles.image} resizeMode='contain' source={require('../../assets/images/SenhaRedefinida.png')} />

                            <Button title={"Voltar ao Login"} buttonStyle={styles.textButton} onPress={() => router.push('/login')} />
                        </View>
                    </>
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        height: "100%",
        width: "100%",
    },
    containerView: {
        flex: 1,
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
    backIcon: {
        fontSize: 30,
        position: "absolute",
        top: 20,
        left: 20,
    },
    image: {
        width: 250,
        height: 200,
        resizeMode: "contain",
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
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    image: {
        height: hp(50),
        width: wp(100),
        alignSelf: "center",
        zIndex: 3,
        marginBottom: 20,
    },
    textButton: {
        color: "#fff",
        fontSize: 18,
        width: "100%",
        marginBottom: 50,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginVertical: 20,
    },
    otpInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        width: 40,
        height: 40,
        textAlign: "center",
        fontSize: 18,
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
});

export default ResetPassword;
