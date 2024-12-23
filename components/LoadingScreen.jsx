import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import { theme } from '../constants/theme'
import React from 'react'

const LoadingScreen = ({size="large", color=theme.colors.primary}) => (
    <Modal transparent={true} animationType="fade" style={{backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
    }
});

export default LoadingScreen;