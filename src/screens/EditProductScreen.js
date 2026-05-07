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
import { updateProductInMongo } from "../services/mongoService";

export default function EditProductScreen({ navigation, route }) {
  const product = route.params?.product || {};

  const [nombre, setNombre] = useState(product.nombre || "");
  const [descripcion, setDescripcion] = useState(product.descripcion || "");
  const [cantidad, setCantidad] = useState(Number(product.cantidad) || 1);
  const [estado, setEstado] = useState(product.estado || "Activo");
  const [saving, setSaving] = useState(false);

  const fechaTexto = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("es-CO")
    : "-";

  const toggleEstado = () =>
    setEstado((prev) => (prev === "Activo" ? "Inactivo" : "Activo"));

  const handleGuardar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Campo requerido", "El nombre del producto no puede estar vacío.");
      return;
    }

    setSaving(true);
    const result = await updateProductInMongo(product._id, {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      cantidad,
      estado,
    });
    setSaving(false);

    if (result.ok) {
      Alert.alert("Guardado", "El producto fue actualizado correctamente.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert("Error", result.reason || "No se pudo actualizar el producto.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Frutas_Fondo_Atardecer.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Fecha de publicación:</Text>
          <Text style={styles.fieldValue}>{fechaTexto}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Estado del producto:</Text>
          <Pressable style={styles.estadoBox} onPress={toggleEstado}>
            <Text style={styles.estadoText}>{estado}</Text>
            <Text style={styles.estadoCheck}>  ✓</Text>
          </Pressable>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Producto:</Text>
          <TextInput
            style={styles.nombreInput}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre del producto"
            placeholderTextColor="#0f3f4f88"
          />
        </View>

        <Text style={styles.descLabel}>Descripción del producto</Text>
        <TextInput
          style={styles.descInput}
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
          textAlignVertical="top"
          placeholder="Escribe una descripción..."
          placeholderTextColor="#0f3f4f88"
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
              style={styles.cantidadBtn}
              onPress={() => setCantidad((c) => Math.max(1, c - 1))}
            >
              <Text style={styles.cantidadBtnText}>−</Text>
            </Pressable>
            <Text style={styles.cantidadValue}>{cantidad}</Text>
            <Pressable
              style={styles.cantidadBtn}
              onPress={() => setCantidad((c) => c + 1)}
            >
              <Text style={styles.cantidadBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[styles.guardarButton, saving && { opacity: 0.6 }]}
          onPress={handleGuardar}
          disabled={saving}
        >
          <Text style={styles.guardarText}>
            {saving ? "Guardando..." : "Guardar cambios"}
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
    paddingTop: 20,
    paddingBottom: 30,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#0f2030",
    minWidth: 140,
  },
  fieldValue: {
    fontSize: 13,
    color: "#0f2030",
  },
  estadoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  estadoText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  estadoCheck: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  nombreInput: {
    flex: 1,
    backgroundColor: "#7cd4d7",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#0f3f4f",
    textAlign: "center",
  },
  descLabel: {
    fontSize: 14,
    color: "#0f2030",
    marginBottom: 8,
  },
  descInput: {
    height: 130,
    backgroundColor: "#7cd4d7",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: "#0f3f4f",
    marginBottom: 20,
  },
  adjuntarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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
    paddingHorizontal: 20,
  },
  examinarText: {
    fontSize: 15,
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
  guardarButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  guardarText: {
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
