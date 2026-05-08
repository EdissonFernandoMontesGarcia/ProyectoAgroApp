import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { changePasswordInMongo } from "../services/mongoService";

export default function ProfileScreen({ navigation, user, onLogout }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      Alert.alert("Campos requeridos", "Completa todos los campos.");
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert("Error", "La nueva contraseña no coincide.");
      return;
    }
    setSaving(true);
    const result = await changePasswordInMongo(user?.email, currentPwd, newPwd);
    setSaving(false);
    if (result.ok) {
      Alert.alert("Éxito", "Contraseña actualizada correctamente.");
      setModalVisible(false);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } else {
      Alert.alert("Error", result.reason || "No se pudo cambiar la contraseña.");
    }
  };

  const tipoLabel = user?.tipoUsuario
    ? user.tipoUsuario.charAt(0).toUpperCase() + user.tipoUsuario.slice(1)
    : "—";

  const FIELDS = [
    { label: "Nombres",      value: user?.nombre },
    { label: "Apellidos",    value: user?.apellidos },
    { label: "Email",        value: user?.email },
    { label: "Celular",      value: user?.celular },
    { label: "Departamento", value: user?.departamento },
    { label: "Ciudad",       value: user?.ciudad },
    { label: "Dirección",    value: user?.direccion },
    { label: "Perfil",       value: tipoLabel },
  ];

  return (
    <ImageBackground
      source={require("../../assets/Frutas_Fondo_Atardecer.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.dimOverlay} />
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{tipoLabel}</Text>
            </View>
          </View>

          {/* Info card */}
          <View style={styles.infoCard}>
            {FIELDS.map((field, index) => (
              <View key={field.label}>
                <View style={styles.row}>
                  <Text style={styles.rowLabel}>{field.label}</Text>
                  <Text style={styles.rowValue} numberOfLines={1}>
                    {field.value || "—"}
                  </Text>
                </View>
                {index < FIELDS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <Pressable
            style={styles.actionButton}
            onPress={() => navigation.navigate("Productos")}
          >
            <Text style={styles.actionButtonText}>🛒  Ir a Productos</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.changePasswordButton]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>🔑  Cambiar contraseña</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => {
              Alert.alert(
                "Cerrar sesión",
                "¿Seguro que deseas cerrar sesión?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: () => {
                      onLogout();
                      navigation.replace("Login");
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.actionButtonText}>🚪  Cerrar sesión</Text>
          </Pressable>

          <Text style={styles.copyright}>® CopyRight AgroApp</Text>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Contraseña actual"
              secureTextEntry
              value={currentPwd}
              onChangeText={setCurrentPwd}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPwd}
              onChangeText={setNewPwd}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirmar nueva contraseña"
              secureTextEntry
              value={confirmPwd}
              onChangeText={setConfirmPwd}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#4caf50" }]}
                onPress={handleChangePassword}
                disabled={saving}
              >
                <Text style={styles.modalBtnText}>
                  {saving ? "Guardando..." : "Guardar"}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#aaa" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#4caf50",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 7,
  },
  avatarIcon: { fontSize: 50 },
  typeBadge: {
    backgroundColor: "#4caf50",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 4,
  },
  typeBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  infoCard: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4caf50",
    width: 105,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1a2e1a",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
  actionButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4caf50",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  changePasswordButton: { backgroundColor: "#7cd4d7" },
  logoutButton: { backgroundColor: "#e05252", marginBottom: 20 },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  copyright: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a2e1a",
    textAlign: "center",
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d0e8d0",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    backgroundColor: "#f6faf6",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
