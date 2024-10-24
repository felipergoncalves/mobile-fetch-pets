import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper';
import BackButton from '../../components/BackButton';
import { resetPassword, verifyCode } from '../../services/userService';

const ResetPassword = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendEmail = async () => {
        // Lógica para enviar e-mail
        if (!email) {
            Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
            return;
        }

        const res = await resetPassword(email);

        if (!res.success) {
            Alert.alert('Erro', 'Não foi possível enviar o e-mail.');
            return
        }

        Alert.alert('E-mail enviado!', 'Verifique sua caixa de entrada para o código.');

        setStep(2);
    };

    const handleVerifyCode = async () => {
        // Lógica para verificar o código
        if (!code) {
            Alert.alert('Erro', 'Por favor, insira um código válido.');
            return;
        }
        const res = await verifyCode(email, code);
        
        if (!res.success) {
            Alert.alert('Erro', 'Código inválido.');
            return;
        }
        setStep(3);
    };

    const handleResetPassword = () => {
        // Lógica para redefinir a senha
        if (newPassword === confirmPassword) {
            Alert.alert('Senha redefinida!', 'Sua senha foi alterada com sucesso.');
            setStep(4);
        } else {
            Alert.alert('Erro', 'As senhas não coincidem.');
        }
    };

    return (
        <ScreenWrapper bg={'white'}>
            <View style={styles.container}>
                <BackButton router={router} />
                {step === 1 && (
                    <>
                        <Text style={styles.title}>Esqueceu a Senha?</Text>
                        <Text style={styles.description}>
                            Não se preocupe! Insira o endereço de e-mail associado à sua conta.
                        </Text>
                        <TextInput
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                        />
                        <Button title="Enviar E-mail" onPress={handleSendEmail} />
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={styles.title}>Verifique seu E-mail</Text>
                        <Text style={styles.description}>
                            Um código foi enviado para o seu e-mail. Insira o código abaixo para continuar.
                        </Text>
                        <TextInput
                            placeholder="Código de Verificação"
                            value={code}
                            onChangeText={setCode}
                            style={styles.input}
                            keyboardType='phone-pad'
                        />
                        <Button title="Verificar Código" onPress={handleVerifyCode} />
                    </>
                )}

                {step === 3 && (
                    <>
                        <Text style={styles.title}>Redefinir Senha</Text>
                        <Text style={styles.description}>
                            Insira sua nova senha abaixo.
                        </Text>
                        <TextInput
                            placeholder="Nova Senha"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Confirmar Nova Senha"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            style={styles.input}
                        />
                        <Button title="Redefinir Senha" onPress={handleResetPassword} />
                    </>
                )}

                {step === 4 && (
                    <>
                        <Text style={styles.title}>Senha Alterada!</Text>
                        <Text style={styles.description}>
                            Sua senha foi alterada com sucesso. Você pode fazer login agora.
                        </Text>
                        <Button title="Voltar ao Login" onPress={() => router.push('/login')} />
                    </>
                )}
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
});

export default ResetPassword;
