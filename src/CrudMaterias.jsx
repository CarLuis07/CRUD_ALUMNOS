import React, { useState, useEffect }  from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CrudMaterias({ route, navigation }) {
  const [alumnoID, setAlumnoID] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const { idAlumno } = route.params;
  const [ asignatura, setAsignatura ] = useState('');

  useEffect(() => {
    fetchAlumnoID();
  }, []);

  const fetchAlumnoID = async () => {
    try {
      const response = await fetch(`http://192.168.1.19:3000/alumnos/${idAlumno}`);
      const data = await response.json();
      setAlumnoID(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAsignaturaByAlumnoID();
  }, []);

  const fetchAsignaturaByAlumnoID = async () => {
    try {
      const response = await fetch(`http://192.168.1.19:3000/asignaturas/${idAlumno}`);
      const data = await response.json();
      setAsignaturas(data);
    } catch (error) {
      console.error(error);
    }
  };
  //'http://localhost:3000/asignaturas'
  const createAsignatura = async () => {
    try {
      const response = await fetch('http://192.168.1.19:3000/asignaturas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({idAlumno, asignatura}),
      });
      const newAsignatura = await response.json();
      setAsignaturas([...asignaturas, newAsignatura]);
      setAsignatura('');
    } catch (error) {
      console.error(error);
    }
  };
  //'http://localhost:3000/asignaturas'
  const updateAsignatura = async (id) => {
    try {
      if (asignatura.length == 0){
        alert("Debe ingresar valores en el campo asignatura y luego dar click en el botón modificar del registro que desea modificar.");
      } else {
        const response = await fetch(`http://192.168.1.19:3000/asignaturas/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({idAlumno, asignatura}),
        });
        if (response.ok) {
          const updatedAsignatura = await response.json();
          setAsignaturas(asignaturas.map(item => item.id === id ? updatedAsignatura : asignatura));
        } else {
          console.error('Error al actualizar asignatura!');
        }
        setAsignatura('');
      }
    } catch (error) {
      console.error(error);
    }
  };
  //'http://localhost:3000/asignaturas'
  const deleteAsignatura = async (id) => {
    try {
      const response = await fetch(`http://192.168.1.19:3000/asignaturas/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAsignaturas(asignaturas.filter((asignatura) => asignatura.id !== id));
      } else {
        console.error('Error al borrar asignatura!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}> 
      <Text style={styles.title}>Asignaturas</Text>
      <Text style={styles.textAlumno}>Nombre del Alumno(a): {'\n'}{alumnoID.nombre} {alumnoID.apellido}.</Text>
      <Text>Nombre de la Asignatura:</Text>
      <TextInput
        style={styles.input}
        placeholder="Asignatura"
        value={asignatura}
        onChangeText={setAsignatura}
      />
      <Button style={styles.botonGuardar} title="Salvar" onPress={createAsignatura} />
      <FlatList
        data={asignaturas}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text>{`${item.id} ${item.asignatura}`}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteAsignatura(item.id)} >
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateButton} onPress={() => updateAsignatura(item.id)} >
              <Ionicons name="create" size={24} color="white" />
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
  textAlumno: {
    fontSize: 18,
    textAlign: 'center', 
    margin: 10,
  },
  botonGuardar: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 5,
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
});