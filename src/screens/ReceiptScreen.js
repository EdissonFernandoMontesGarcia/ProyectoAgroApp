import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../utils/formatters";

export default function ReceiptScreen({ navigation, route, currency }) {
  const receipt = route.params?.receipt;

  if (!receipt) {
    return (
      <ImageBackground
        source={require("../../assets/Fondo_Abstracto_Azul.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>No hay comprobante</Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.replace("Productos")}
          >
            <Text style={styles.buttonText}>Volver a productos</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/Fondo_Abstracto_Azul.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Comprobante de pago</Text>
        <View style={styles.card}>
          <Text style={styles.line}>Recibo: {receipt.receiptCode}</Text>
          <Text style={styles.line}>Estado: {receipt.status}</Text>
          <Text style={styles.line}>Metodo: {receipt.paymentMethod}</Text>
          <Text style={styles.line}>Fecha: {receipt.dateText}</Text>
          <Text style={styles.line}>
            Total: {formatCurrency(receipt.total, currency)}
          </Text>
          <Text style={styles.note}>{receipt.mongoStatus}</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => navigation.replace("Productos")}
        >
          <Text style={styles.buttonText}>Seguir comprando</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(233, 243, 255, 0.72)",
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f3f4f",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#7cd4d7",
    borderRadius: 8,
    paddingVertical: 7,
  },
  card: {
    borderWidth: 1,
    borderColor: "#9fcdd1",
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.94)",
    padding: 12,
    gap: 4,
  },
  line: {
    color: "#16344a",
    fontSize: 12,
  },
  note: {
    marginTop: 4,
    color: "#2d5f80",
    fontSize: 11,
  },
  button: {
    marginTop: 12,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
  },
  buttonText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 12,
  },
});
