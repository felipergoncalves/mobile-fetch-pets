import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const CustomSelect = ({ options, placeholder, onSelect, style }) => {
    const [selectedValue, setSelectedValue] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSelect = (item) => {
        setSelectedValue(item);
        onSelect(item);
        setIsModalVisible(false);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.selectButton}>
                <Text style={styles.selectedText}>
                    {selectedValue ? selectedValue : placeholder}
                </Text>
            </TouchableOpacity>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.option}>
                                <Text style={styles.optionText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 56, // Defina conforme necessário ou use hp(7.2)
        alignItems: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        paddingHorizontal: 18,
        gap: 12,
        width: '100%',
    },
    selectButton: {
        flex: 1,
        justifyContent: 'center',
    },
    selectedText: {
        color: theme.colors.text,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    option: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: theme.colors.text,
    },
});

export default CustomSelect;