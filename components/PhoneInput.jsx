import { View, TextInput, StyleSheet } from 'react-native';
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import React from 'react';

const PhoneInput = ({ countryCode = '+55', onCountryCodeChange, onPhoneChange, phoneValue, style }) => {
    return (
        <View style={[styles.container, style]}>
            {/* Código de País */}
            <TextInput
                style={styles.countryCodeInput}
                value={countryCode}
                onChangeText={onCountryCodeChange}
                keyboardType="phone-pad"
                maxLength={4}
                placeholder="+DD"
            />
            {/* Input de Número de Telefone */}
            <TextInput
                value={phoneValue}
                onChangeText={onPhoneChange}
                keyboardType="phone-pad"
                placeholder="Número de telefone"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12,
        width: '100%'
    },
    countryCodeInput: {
        justifyContent: 'flex-start'
    }
})

export default PhoneInput;