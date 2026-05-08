import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos requeridos", "Ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    const result = await onLogin(email.trim(), password.trim());
    setLoading(false);
    if (result?.ok) {
      navigation.replace("Perfil");
    } else {
      Alert.alert("Error al ingresar", result?.reason || "Credenciales incorrectas");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>AgroApp</Text>

        <Text style={styles.userLabel}>Usuario</Text>

        <TextInput
          placeholder="email@gmail.com"
          placeholderTextColor="#6f6f6f"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#6f6f6f"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Validando..." : "Ingresar"}
          </Text>
        </Pressable>

        <Text style={styles.recoverText}>Recuperar Contraseña</Text>
        <View style={styles.separatorLine} />

        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Registro")}
        >
          <Text style={styles.secondaryButtonText}>Rgistrarse</Text>
        </Pressable>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Aquí podrá vender tus productos del campo sin intermediarios .
          </Text>
          <Text style={styles.footerCopy}>® CopyRight AgroApp</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: "transparent",
  },
  title: {
    textAlign: "center",
    color: "#000",
    fontSize: 70,
    lineHeight: 82,
    marginTop: 14,
    marginBottom: 26,
    fontFamily: Platform.select({
      ios: "Snell Roundhand",
      android: "serif",
      default: undefined,
    }),
    paddingHorizontal: 6,
    alignSelf: "center",
  },
  userLabel: {
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 24,
    textAlign: "center",
    color: "#000",
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 14,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 22,
    height: 58,
    fontSize: 14,
    marginBottom: 20,
  },
  primaryButton: {
    height: 58,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
  recoverText: {
    textAlign: "center",
    color: "#101010",
    fontSize: 15,
    marginTop: 28,
    marginBottom: 22,
  },
  separatorLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#d8d8d8",
    marginBottom: 24,
  },
  secondaryButton: {
    height: 58,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  secondaryButtonText: {
    color: "#151515",
    fontWeight: "700",
    fontSize: 14,
  },
  footerContainer: {
    marginTop: "auto",
    marginBottom: 30,
    gap: 18,
  },
  footerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    lineHeight: 30,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  footerCopy: {
    color: "#fff",
    textAlign: "center",
    fontSize: 24,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
});
