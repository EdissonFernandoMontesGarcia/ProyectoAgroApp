import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveRatingToMongo } from "../services/mongoService";

const PREGUNTAS = [
  {
    key: "experienciaGeneral",
    texto: "¿Cómo calificarías tu experiencia general?",
    tipo: "numero",
  },
  {
    key: "calidadProducto",
    texto: "¿Cómo calificarías la calidad del  producto que recibiste?",
    tipo: "numero",
  },
  {
    key: "relacionPrecioCalidad",
    texto: "¿Qué opinas sobre la relación entre el precio y la calidad de nuestro producto?",
    tipo: "numero",
  },
  {
    key: "tiempoRespuesta",
    texto: "¿Estás satisfecho/a con el tiempo de respuesta de nuestro equipo?",
    tipo: "numero",
  },
  {
    key: "mejorar",
    texto: "¿Hay algo específico que creas que podríamos mejorar en nuestro producto/servicio?",
    tipo: "sino",
  },
];

function RatingSelector({ valor, onChange }) {
  return (
    <View style={styles.selectorRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          style={[styles.numBtn, valor === n && styles.numBtnActive]}
          onPress={() => onChange(n)}
        >
          <Text style={[styles.numBtnText, valor === n && styles.numBtnTextActive]}>
            {n}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function SiNoSelector({ valor, onChange }) {
  return (
    <View style={styles.sinoRow}>
      {["Si", "No"].map((op) => (
        <Pressable
          key={op}
          style={[styles.sinoBtn, valor === op && styles.sinoBtnActive]}
          onPress={() => onChange(op)}
        >
          <Text style={[styles.sinoBtnText, valor === op && styles.sinoBtnTextActive]}>
            {op}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default function RatingScreen({ navigation, route }) {
  const { receipt, user } = route.params || {};

  const [valores, setValores] = useState({
    experienciaGeneral: 5,
    calidadProducto: 4,
    relacionPrecioCalidad: 3,
    tiempoRespuesta: 5,
    mejorar: "No",
  });
  const [guardando, setGuardando] = useState(false);

  const setValor = (key, val) =>
    setValores((prev) => ({ ...prev, [key]: val }));

  const handleGuardar = async () => {
    setGuardando(true);
    const payload = {
      facturaId: receipt?.receiptCode || "",
      usuario: user?.email || "",
      fechaCalificacion: new Date().toISOString(),
      calificaciones: valores,
    };
    const result = await saveRatingToMongo(payload);
    setGuardando(false);

    if (result.ok) {
      Alert.alert(
        "¡Gracias!",
        "Tu calificación fue guardada correctamente.",
        [{ text: "OK", onPress: () => navigation.replace("Productos") }]
      );
    } else {
      Alert.alert("Error", result.reason || "No se pudo guardar la calificación.");
    }
  };

  const fechaFormateada = receipt?.dateText
    ? receipt.dateText.split(",")[0]
    : new Date().toLocaleDateString("es-CO");

  return (
    <ImageBackground
      source={require("../../assets/Frutas_Fondo_Atardecer.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Número de factura */}
          <Text style={styles.facturaNum}>
            Factura-{receipt?.receiptCode?.split("-").pop() || "1001"}
          </Text>

          {/* Datos del pedido */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nombre del  producto:</Text>
              <Text style={styles.infoValor}>
                {receipt?.productoNombre || "Producto AgroApp"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vendido por:</Text>
              <Text style={styles.infoValor}>
                {receipt?.vendedor || user?.nombre || "Vendedor"}
              </Text>
              <Text style={styles.infoFecha}>{fechaFormateada}</Text>
            </View>
          </View>

          {/* Instrucción */}
          <Text style={styles.instruccion}>
            Siendo 5 la calificación mas alta por favor evalúe{"\n"}nuestro sistema
          </Text>

          {/* Preguntas */}
          {PREGUNTAS.map((p) => (
            <View key={p.key} style={styles.preguntaRow}>
              <Text style={styles.preguntaTexto}>{p.texto}</Text>
              {p.tipo === "numero" ? (
                <RatingSelector
                  valor={valores[p.key]}
                  onChange={(v) => setValor(p.key, v)}
                />
              ) : (
                <SiNoSelector
                  valor={valores[p.key]}
                  onChange={(v) => setValor(p.key, v)}
                />
              )}
            </View>
          ))}

          {/* Botón guardar */}
          <Pressable
            style={[styles.guardarBtn, guardando && styles.guardarBtnDisabled]}
            onPress={handleGuardar}
            disabled={guardando}
          >
            <Text style={styles.guardarBtnText}>
              {guardando ? "Guardando..." : "Guardar"}
            </Text>
          </Pressable>

          {/* Copyright */}
          <Text style={styles.copyright}>© CopyRight AgroApp</Text>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: {
    padding: 18,
    paddingTop: 10,
  },
  facturaNum: {
    textAlign: "right",
    fontSize: 13,
    fontWeight: "600",
    color: "#1b3a4a",
    marginBottom: 10,
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: "#1b3a4a",
    fontWeight: "600",
  },
  infoValor: {
    fontSize: 13,
    color: "#1b3a4a",
  },
  infoFecha: {
    fontSize: 13,
    color: "#1b3a4a",
    marginLeft: 8,
  },
  instruccion: {
    fontSize: 13,
    color: "#1b3a4a",
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 8,
    padding: 10,
    lineHeight: 20,
  },
  preguntaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    gap: 8,
  },
  preguntaTexto: {
    flex: 1,
    fontSize: 12,
    color: "#1b3a4a",
    lineHeight: 18,
    textAlign: "center",
  },
  selectorRow: {
    flexDirection: "row",
    gap: 4,
  },
  numBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#7cd4d7",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  numBtnActive: {
    backgroundColor: "#7cd4d7",
    borderColor: "#7cd4d7",
  },
  numBtnText: {
    fontSize: 12,
    color: "#1b3a4a",
    fontWeight: "600",
  },
  numBtnTextActive: {
    color: "#0f3f4f",
    fontWeight: "700",
  },
  sinoRow: {
    flexDirection: "row",
    gap: 4,
  },
  sinoBtn: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#7cd4d7",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  sinoBtnActive: {
    backgroundColor: "#7cd4d7",
    borderColor: "#7cd4d7",
  },
  sinoBtnText: {
    fontSize: 12,
    color: "#1b3a4a",
    fontWeight: "600",
  },
  sinoBtnTextActive: {
    color: "#0f3f4f",
    fontWeight: "700",
  },
  guardarBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7cd4d7",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 20,
  },
  guardarBtnDisabled: {
    opacity: 0.55,
  },
  guardarBtnText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  copyright: {
    textAlign: "center",
    marginTop: 18,
    marginBottom: 8,
    fontSize: 11,
    color: "#1b3a4a",
  },
});
