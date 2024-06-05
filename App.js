import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Crud from "./src/Crud";
import CrudMaterias from "./src/CrudMaterias";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Crud">
        <Stack.Screen
          name="Crud"
          component={Crud}
          options={{ title: "Alumnos" }}
        />
        <Stack.Screen
          name="CrudMaterias"
          component={CrudMaterias}
          options={{ title: "Asignaturas del Alumno" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
