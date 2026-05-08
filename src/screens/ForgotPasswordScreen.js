import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetPasswordInMongo } from "../services/mongoService";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Campos requeridos", "Completa todos los campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden.");
      return;
    }
    if (newPassword.length < 4) {
      Alert.alert("Error", "La contraseña debe tener al menos 4 caracteres.");
      return;
    }
    setLoading(true);
    const result = await resetPasswordInMongo(email.trim(), newPassword.trim());
    setLoading(false);
    if (result.ok) {
      Alert.alert(
        "Contraseña actualizada",
        "Tu contraseña fue restablecida correctamente. Ya puedes ingresar.",
        [{ text: "Ir a Ingresar", onPress: () => navigation.replace("Login") }]
      );
    } else {
      Alert.alert("Error", result.reason || "No se pudo restablecer la contraseña.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.title}>Recuperar{"\n"}Contraseña</Text>

        <Text style={styles.subtitle}>
          Ingresa tu correo registrado y una nueva contraseña.
        </Text>

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#6f6f6f"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
        />

        <TextInput
          placeholder="Nueva contraseña"
          placeholderTextColor="#6f6f6f"
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirmar nueva contraseña"
          placeholderTextColor="#6f6f6f"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.primaryButton, loading && { opacity: 0.6 }]}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? "Procesando..." : "Restablecer contraseña"}
          </Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver a Ingresar</Text>
        </Pressable>

        <View style={styles.footerContainer}>
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
    fontSize: 42,
    lineHeight: 50,
    marginTop: 30,
    marginBottom: 16,
    fontWeight: "700",
    alignSelf: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#222",
    fontSize: 14,
    marginBottom: 28,
    lineHeight: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    backgroundColor: "#4caf50",
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  backText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
  footerContainer: {
    marginTop: "auto",
    marginBottom: 30,
  },
  footerCopy: {
    color: "#fff",
    textAlign: "center",
    fontSize: 13,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 3,
    textShadowOffset: { width: 0, height: 1 },
  },
});
