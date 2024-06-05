import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Crud({ navigation }) {
  const [alumnos, setAlumnos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  useEffect(() => {
    fetchAlumnos();
  }, []);
  const fetchAlumnos = async () => {
    try {
      const response = await fetch('http://192.168.1.19:3000/alumnos');
      const data = await response.json();
      setAlumnos(data); 
    } catch (error) {
      console.error(error);
    }
  };
  const createAlumno = async () => {
    try {
      const response = await fetch('http://192.168.1.19:3000/alumnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nombre, apellido}),
      });
      const newAlumno = await response.json();
      setAlumnos([...alumnos, newAlumno]);
      setNombre('');
      setApellido('');
    } catch (error) {
      console.error(error);
    }
  };
  const updateAlumno = async (id) => {
    try {
      if (nombre.length == 0 || apellido.length == 0){
        alert("Debe ingresar valores en los campos nombre y apellido y luego dar click en el botón modificar del registro que desea modificar.");
      } else {
        const response = await fetch(`http://192.168.1.19:3000/alumnos/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({nombre, apellido}),
        });
        if (response.ok) {
          const updatedAlumno = await response.json();
          setAlumnos(alumnos.map(alumno => alumno.id === id ? updatedAlumno : alumno));
        } else {
          console.error('Error al actualizar alumno!');
        }
        setNombre('');
        setApellido('');
      }
    } catch (error) {
      console.error(error);
    }
  };
  const deleteAlumno = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.19:3000/alumnos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlumnos(alumnos.filter((alumno) => alumno.id !== id));
      } else {
        console.error('Error al borrar estudiante!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso de Alumnos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput 
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />
      <Button title="Crear Alumno" onPress={createAlumno} />

      <FlatList
        data={alumnos}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text>{`${item.nombre} ${item.apellido}`}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAlumno(item.id)} >
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={() => updateAlumno(item.id)} >
              <Ionicons name="create" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.subjectButton} onPress={() => navigation.navigate('CrudMaterias', { idAlumno: item.id })}>
              <Ionicons name="book" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 20,
    width: '90%',
    marginEnd: 20, 
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    textAlign: 'center', 
    fontWeight: 'bold',
    marginBottom: 16,
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: 'red',
    colorText: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
  },
  subjectButton: {
    backgroundColor: 'green',
    colorText: 'white',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 12,
  },
});
