import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../constants/api';

export default function CrearEventoScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      await api.post('/events', {
        title,
        description,
        location,
        date: date.toISOString().split('T')[0],
      });
      router.replace('/eventos');
    } catch (error) {
      console.error('Error al crear evento:', error);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/eventos')}>
          <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 12 }} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Crear evento</Text>
          <Text style={styles.headerSubtitle}>Completa los campos para crear tu evento</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre del evento*</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Descripción*</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu descripción"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Ubicación*</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu ubicación"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Fecha del evento*</Text>
        <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
          <Text>{date.toISOString().split('T')[0]}</Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Agregar evento</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    marginTop: 4,
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
