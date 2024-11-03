import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const Checkbox = ({ label, checked, onChange, style }) => {
    return (
        <TouchableOpacity
            onPress={() => onChange(!checked)}
            style={[styles.container, style]}>
            <View style={[styles.checkbox, checked && styles.checked]}>
                {checked && <Text style={styles.checkmark}>✔</Text>}
            </View>
            {label && <Text style={styles.label}>{label}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    checked: {
        backgroundColor: '#4CAF50',
    },
    checkmark: {
        color: '#fff',
        fontSize: 12,
    },
    label: {
        fontSize: 16,
        color: '#696969',
        flexShrink: 1,
    },
});

export default Checkbox;
