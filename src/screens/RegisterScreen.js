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
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

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
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert("Campos obligatorios", "Completa nombre, email y contraseña.");
      return;
    }
    if (!["vendedor", "cliente"].includes(form.tipoUsuario)) {
      Alert.alert("Tipo de usuario", "Selecciona Cliente o Vendedor.");
      return;
    }
    setSaving(true);
    const result = await onRegister(form);
    setSaving(false);
    if (!result?.saved) {
      Alert.alert("Error al guardar", result?.reason || "Sin respuesta del servidor");
    } else {
      Alert.alert("¡Registro exitoso!", "Tu cuenta ha sido creada correctamente.");
      navigation.replace("Perfil");
    }
  };

  const FIELDS = [
    { key: "nombre",      placeholder: "Nombres",       icon: "user",      keyboard: "default",       secure: false },
    { key: "apellidos",   placeholder: "Apellidos",     icon: "users",     keyboard: "default",       secure: false },
    { key: "email",       placeholder: "Correo electrónico", icon: "mail", keyboard: "email-address", secure: false },
    { key: "celular",     placeholder: "Celular",       icon: "phone",     keyboard: "phone-pad",     secure: false },
    { key: "departamento",placeholder: "Departamento",  icon: "map-pin",   keyboard: "default",       secure: false },
    { key: "ciudad",      placeholder: "Ciudad",        icon: "map-pin",   keyboard: "default",       secure: false },
    { key: "direccion",   placeholder: "Dirección",     icon: "home",      keyboard: "default",       secure: false },
  ];

  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.dimOverlay} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Feather name="user-plus" size={32} color="#4caf50" />
            </View>
            <Text style={styles.headerTitle}>Crear cuenta</Text>
            <Text style={styles.headerSubtitle}>Completa tus datos para registrarte</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {FIELDS.map((field) => (
              <View key={field.key} style={styles.inputWrapper}>
                <Feather name={field.icon} size={17} color="#4caf50" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor="#a0a0a0"
                  keyboardType={field.keyboard}
                  autoCapitalize={field.key === "email" ? "none" : "sentences"}
                  autoCorrect={false}
                  value={form[field.key]}
                  onChangeText={(v) => updateField(field.key, v)}
                />
              </View>
            ))}

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={17} color="#4caf50" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Contraseña"
                placeholderTextColor="#a0a0a0"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(v) => updateField("password", v)}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={19} color="#888" />
              </Pressable>
            </View>

            {/* Tipo de usuario */}
            <Text style={styles.sectionLabel}>Tipo de usuario</Text>
            <View style={styles.typeRow}>
              {["cliente", "vendedor"].map((tipo) => {
                const active = form.tipoUsuario === tipo;
                const icon = tipo === "cliente" ? "shopping-bag" : "tag";
                return (
                  <Pressable
                    key={tipo}
                    style={[styles.typeBtn, active && styles.typeBtnActive]}
                    onPress={() => updateField("tipoUsuario", tipo)}
                  >
                    <Feather
                      name={icon}
                      size={16}
                      color={active ? "#fff" : "#4caf50"}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.typeBtnText, active && styles.typeBtnTextActive]}>
                      {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Botones */}
            <Pressable
              style={[styles.registerBtn, saving && { opacity: 0.65 }]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Feather name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.registerBtnText}>{saving ? "Registrando..." : "Registrar"}</Text>
            </Pressable>

            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={16} color="#4caf50" style={{ marginRight: 6 }} />
              <Text style={styles.backBtnText}>Volver al ingreso</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 2 },
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 22,
    padding: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#d4edda",
    borderRadius: 14,
    backgroundColor: "#f7fdf7",
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#1a2e1a",
  },
  eyeBtn: {
    paddingLeft: 10,
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4caf50",
    marginTop: 4,
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#4caf50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fdf7",
  },
  typeBtnActive: {
    backgroundColor: "#4caf50",
    borderColor: "#43a047",
  },
  typeBtnText: {
    color: "#4caf50",
    fontWeight: "700",
    fontSize: 14,
  },
  typeBtnTextActive: {
    color: "#fff",
  },
  registerBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4caf50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#4caf50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  registerBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.4,
  },
  backBtn: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: "#4caf50",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  backBtnText: {
    color: "#4caf50",
    fontWeight: "700",
    fontSize: 14,
  },
});
