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
import { changePasswordInMongo } from "../services/mongoService";

export default function ProfileScreen({ navigation, user }) {
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

  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable
          style={styles.productsButton}
          onPress={() => navigation.navigate("Productos")}
        >
          <Text style={styles.productsButtonText}>Ir a{"\n"}Productos</Text>
        </Pressable>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Nombres:</Text>
            <Text style={styles.value}>{user?.nombre || "-"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Apellidos:</Text>
            <Text style={styles.value}>{user?.apellidos || "-"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || "-"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Departamento:</Text>
            <Text style={styles.value}>{user?.departamento || "-"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Ciudad:</Text>
            <Text style={styles.value}>{user?.ciudad || "-"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Direccion:</Text>
            <Text style={styles.value}>{user?.direccion || "-"}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Perfil:</Text>
            <Text style={styles.value}>
              {user?.tipoUsuario
                ? user.tipoUsuario.charAt(0).toUpperCase() + user.tipoUsuario.slice(1)
                : "-"}
            </Text>
          </View>
        </View>

        <View style={styles.passwordRow}>
          <Text style={styles.passwordLabel}>Cambiar contraseña:</Text>
          <Pressable
            style={styles.changeButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.changeButtonText}>Cambiar</Text>
          </Pressable>
        </View>

        <Text style={styles.copyright}>® CopyRight AgroApp</Text>
      </ScrollView>

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
                style={[styles.modalBtn, { backgroundColor: "#7cd4d7" }]}
                onPress={handleChangePassword}
                disabled={saving}
              >
                <Text style={styles.modalBtnText}>
                  {saving ? "Guardando..." : "Guardar"}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
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
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  productsButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignSelf: "center",
    marginBottom: 20,
  },
  productsButtonText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#7cd4d7",
  },
  avatarIcon: {
    fontSize: 56,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "rgba(210, 230, 245, 0.88)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 22,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  label: {
    fontWeight: "700",
    fontSize: 13,
    color: "#0f2030",
    width: 120,
  },
  value: {
    fontSize: 13,
    color: "#0f2030",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,180,200,0.4)",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 18,
  },
  passwordLabel: {
    fontSize: 14,
    color: "#0f2030",
    fontWeight: "500",
  },
  changeButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  changeButtonText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 15,
  },
  copyright: {
    color: "#334",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f3f4f",
    textAlign: "center",
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#8bcfd2",
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 13,
    backgroundColor: "#f7fcfd",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#0f3f4f",
  },
});
