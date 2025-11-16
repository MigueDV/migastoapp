import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';


const HomeScreen = ({ navigation }: any) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Panel Principal 💰</Text>
        <Text style={styles.subtitle}>Resumen de tus gastos</Text>
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        color: '#444',
    },
});
