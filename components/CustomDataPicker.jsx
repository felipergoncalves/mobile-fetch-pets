import React, { useState, useEffect  } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { hp } from '../helpers/common';
import { theme } from '../constants/theme'
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDatePicker = ({ placeholder = "Selecione uma data", onDateChange, style, value }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(null);

    // Sincroniza o estado da data com o valor recebido como prop
    useEffect(() => {
        if (value) {
            const [day, month, year] = value.split('/').map(Number);
            const newData = new Date(year, month - 1, day);
            setDate(newData);
        }
    }, [value]); // Atualiza apenas quando `value` mudar

    const handleConfirm = (event, selectedDate) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
            onDateChange(selectedDate);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
                <Text style={styles.dateText} placeholderTextColor={theme.colors.textLight} >{date ? date.toLocaleDateString() : placeholder}</Text>
            </TouchableOpacity>
            {showPicker && (
                <View style={styles.modalContainer}  >
                        <DateTimePicker
                            value={date || new Date()}
                            mode="date"
                            display="calendar"
                            onChange={handleConfirm}
                        />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp(7.2),
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        paddingHorizontal: 18,
        gap: 12,
        justifyContent: 'flex-start',
        backgroundColor: '#fff'
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CustomDatePicker;
