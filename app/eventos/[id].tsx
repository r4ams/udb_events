import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import api from '../../constants/api';
import { useAuth } from '../context/AuthContext';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [asistencia, setAsistencia] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(1);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/login');
    }
  }, [authLoading, token]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await api.get(`/events/${id}/comments`);
        setComments(res.data);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
      }
    };

    const fetchAsistencia = async () => {
      try {
        const res = await api.get(`/events/${id}/rsvp/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAsistencia(res.data.status);
      } catch (error) {
        console.error('Error al obtener estado de asistencia:', error);
      }
    };

    if (token) {
      fetchEvent();
      fetchComments();
      fetchAsistencia();
    }
  }, [id, token]);

  const confirmarAsistencia = async () => {
    try {
      const res = await api.post(`/events/${id}/rsvp`, { status: 'attending' });
      if (res.status === 200) {
        Toast.show({ type: 'success', text1: 'Asistencia confirmada' });
        setAsistencia('attending');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo registrar tu asistencia',
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo registrar tu asistencia',
      });
    }
  };

  const enviarComentario = async () => {
    if (!newComment) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El comentario no puede estar vacío',
      });
      return;
    }

    try {
      await api.post(`/events/${id}/comments`, {
        comment: newComment,
        rating,
      });
      setNewComment('');
      setRating(1);
      Toast.show({ type: 'success', text1: 'Comentario enviado' });
      const res = await api.get(`/events/${id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'al enviar comentario' });
    }
  };

  if (authLoading || loading || !event) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/eventos')}>
          <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 12 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del evento</Text>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.meta}>{event.date} • {event.time}</Text>
        <Text style={styles.location}>📍 {event.location}</Text>
        <Text style={styles.description}>{event.description}</Text>

        {asistencia === 'attending' ? (
          <Text style={{ marginBottom: 10, fontWeight: 'bold', color: 'green' }}>
            ✅ Ya confirmaste tu asistencia
          </Text>
        ) : (
          <Button title="Confirmar asistencia" onPress={confirmarAsistencia} />
        )}

        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>Dejá un comentario</Text>
          <TextInput
            placeholder="Escribí tu comentario..."
            value={newComment}
            onChangeText={setNewComment}
            style={styles.input}
            multiline
          />
          <Text style={{ marginVertical: 6 }}>Calificación: {rating} ⭐</Text>
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <Text
                key={val}
                style={[styles.star, rating >= val ? styles.selectedStar : styles.unselectedStar]}
                onPress={() => setRating(val)}
              >
                ⭐
              </Text>
            ))}
          </View>
          <Button title="Enviar comentario" onPress={enviarComentario} />
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>Comentarios</Text>
          {comments.map((c) => (
            <View key={c.id} style={styles.commentCard}>
              <Text style={styles.commentUser}>{c.user.name}</Text>
              <Text>{'⭐'.repeat(c.rating)}</Text>
              <Text>{c.comment}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bodyContainer: {
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  meta: { color: '#888', marginBottom: 5 },
  location: { marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  star: {
    fontSize: 32,
    marginHorizontal: 4,
  },
  selectedStar: {
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  unselectedStar: {
    color: '#ccc',
    opacity: 0.6,
  },
  commentCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
