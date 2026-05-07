import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterScreen({ navigation, onRegister }) {
  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    celular: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    tipoUsuario: "cliente",
  });

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert("Campos obligatorios", "Completa nombre, email y password.");
      return;
    }

    if (!["vendedor", "cliente"].includes(form.tipoUsuario)) {
      Alert.alert(
        "Tipo de usuario invalido",
        "Selecciona cliente o vendedor para continuar."
      );
      return;
    }

    const result = await onRegister(form);

    if (!result?.saved) {
      Alert.alert(
        "Error al guardar en Mongo",
        result?.reason || "Sin respuesta del servidor"
      );
    } else {
      Alert.alert("Registro exitoso", `Guardado en Mongo (ID: ${result.insertedId})`);
    }

    navigation.replace("Perfil");
  };

  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formCard}>
          <Text style={styles.title}>Registro de Usuario</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={form.nombre}
            onChangeText={(value) => updateField("nombre", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellidos"
            value={form.apellidos}
            onChangeText={(value) => updateField("apellidos", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            keyboardType="email-address"
            value={form.email}
            onChangeText={(value) => updateField("email", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={form.password}
            onChangeText={(value) => updateField("password", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Celular"
            keyboardType="phone-pad"
            value={form.celular}
            onChangeText={(value) => updateField("celular", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Departamento"
            value={form.departamento}
            onChangeText={(value) => updateField("departamento", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Ciudad"
            value={form.ciudad}
            onChangeText={(value) => updateField("ciudad", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Direccion"
            value={form.direccion}
            onChangeText={(value) => updateField("direccion", value)}
          />
          <View style={styles.userTypeRow}>
            <Pressable
              style={[
                styles.userTypeButton,
                form.tipoUsuario === "cliente" && styles.userTypeButtonActive,
              ]}
              onPress={() => updateField("tipoUsuario", "cliente")}
            >
              <Text style={styles.userTypeText}>Cliente</Text>
            </Pressable>
            <Pressable
              style={[
                styles.userTypeButton,
                form.tipoUsuario === "vendedor" && styles.userTypeButtonActive,
              ]}
              onPress={() => updateField("tipoUsuario", "vendedor")}
            >
              <Text style={styles.userTypeText}>Vendedor</Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Pressable style={styles.primaryButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Registrar</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Regresar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 18,
    backgroundColor: "rgba(238, 246, 240, 0.78)",
    flexGrow: 1,
    justifyContent: "center",
  },
  formCard: {
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#7cd4d7",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    color: "#0f3f4f",
    textAlign: "center",
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#7cd4d7",
  },
  input: {
    borderWidth: 1,
    borderColor: "#8bcfd2",
    borderRadius: 8,
    backgroundColor: "#fff",
    height: 34,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  row: {
    marginTop: 6,
    flexDirection: "row",
    gap: 10,
  },
  userTypeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  userTypeButton: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8bcfd2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fcfd",
  },
  userTypeButtonActive: {
    backgroundColor: "#7cd4d7",
    borderColor: "#6bc1c4",
  },
  userTypeText: {
    color: "#0f3f4f",
    fontSize: 12,
    fontWeight: "700",
  },
  primaryButton: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
  },
  secondaryButton: {
    flex: 1,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5fbec2",
  },
  buttonText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 12,
  },
});
