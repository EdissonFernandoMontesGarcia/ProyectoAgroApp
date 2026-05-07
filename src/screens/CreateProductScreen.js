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

export default function CreateProductScreen({ navigation, onSaveProduct, user }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleRegistrar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Campo requerido", "Escribe el nombre del producto.");
      return;
    }

    setSaving(true);
    const result = await onSaveProduct({
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      cantidad: Number(cantidad),
      vendedor: user?.email || "",
      createdAt: new Date().toISOString(),
    });
    setSaving(false);

    if (result?.saved) {
      Alert.alert("Producto registrado", "El producto fue guardado correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", result?.reason || "No se pudo guardar el producto.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Frutas_Fondo_Atardecer.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Nombre del{"\n"}producto</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="Escribe un titulo..."
            placeholderTextColor="#888"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <Text style={styles.descLabel}>Descripción del producto</Text>
        <TextInput
          style={styles.descInput}
          placeholder=""
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
          textAlignVertical="top"
        />

        <View style={styles.adjuntarRow}>
          <Text style={styles.adjuntarLabel}>Adjuntar imagen</Text>
          <Pressable style={styles.examinarButton}>
            <Text style={styles.examinarText}>Examinar...</Text>
          </Pressable>
        </View>

        <View style={styles.cantidadRow}>
          <Text style={styles.cantidadLabel}>Cantidad del producto:</Text>
          <View style={styles.cantidadBox}>
            <Pressable
              onPress={() => setCantidad((c) => Math.max(1, Number(c) - 1))}
              style={styles.cantidadBtn}
            >
              <Text style={styles.cantidadBtnText}>−</Text>
            </Pressable>
            <Text style={styles.cantidadValue}>{cantidad}</Text>
            <Pressable
              onPress={() => setCantidad((c) => Number(c) + 1)}
              style={styles.cantidadBtn}
            >
              <Text style={styles.cantidadBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.registrarButton, saving && { opacity: 0.6 }]}
          onPress={handleRegistrar}
          disabled={saving}
        >
          <Text style={styles.registrarText}>
            {saving ? "Guardando..." : "Registrar"}
          </Text>
        </Pressable>

        <Text style={styles.copyright}>® CopyRight AgroApp</Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 30,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f2030",
    width: 90,
    lineHeight: 20,
  },
  fieldInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#c0dde0",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#111",
  },
  descLabel: {
    fontSize: 14,
    color: "#0f2030",
    textAlign: "center",
    marginBottom: 8,
  },
  descInput: {
    height: 140,
    borderRadius: 10,
    backgroundColor: "#7cd4d7",
    padding: 12,
    fontSize: 13,
    color: "#0f2030",
    marginBottom: 20,
    borderWidth: 0,
  },
  adjuntarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  adjuntarLabel: {
    fontSize: 14,
    color: "#0f2030",
    fontWeight: "500",
  },
  examinarButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  examinarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  cantidadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  cantidadLabel: {
    fontSize: 14,
    color: "#0f2030",
    fontWeight: "500",
  },
  cantidadBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
    borderRadius: 10,
    overflow: "hidden",
  },
  cantidadBtn: {
    width: 32,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  cantidadBtnText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  cantidadValue: {
    width: 36,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  registrarButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  registrarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  copyright: {
    textAlign: "center",
    fontSize: 11,
    color: "#334",
  },
});
