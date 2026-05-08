import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
          <Text style={styles.emptyText}>No hay comprobante</Text>
          <Pressable style={styles.primaryBtn} onPress={() => navigation.replace("Productos")}>
            <Text style={styles.primaryBtnText}>Volver a productos</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  const isApproved = receipt.status === "Aprobada";

  return (
    <ImageBackground
      source={require("../../assets/Fondo_Abstracto_Azul.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.dimOverlay} />
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <View style={styles.overlay}>

          {/* Icono de estado */}
          <View style={[styles.iconCircle, isApproved ? styles.iconSuccess : styles.iconFail]}>
            <Text style={styles.iconText}>{isApproved ? "✓" : "✗"}</Text>
          </View>

          <Text style={styles.statusLabel}>
            {isApproved ? "¡Pago exitoso!" : "Pago no aprobado"}
          </Text>

          {/* Tarjeta */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderText}>Comprobante de pago</Text>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Recibo</Text>
                <Text style={styles.rowValue} numberOfLines={1}>{receipt.receiptCode}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Estado</Text>
                <View style={[styles.badge, isApproved ? styles.badgeSuccess : styles.badgeFail]}>
                  <Text style={styles.badgeText}>{receipt.status}</Text>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Método</Text>
                <Text style={styles.rowValue}>{receipt.paymentMethod}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Fecha</Text>
                <Text style={styles.rowValue}>{receipt.dateText}</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.row}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(receipt.total, currency)}</Text>
              </View>
            </View>

            {receipt.mongoStatus ? (
              <Text style={styles.note}>{receipt.mongoStatus}</Text>
            ) : null}
          </View>

          {/* Botones */}
          <Pressable style={styles.primaryBtn} onPress={() => navigation.replace("Productos")}>
            <Text style={styles.primaryBtnText}>🛒  Seguir comprando</Text>
          </Pressable>

          <Pressable
            style={styles.ratingBtn}
            onPress={() => navigation.navigate("Calificacion", { receipt })}
          >
            <Text style={styles.ratingBtnText}>⭐  Calificar compra</Text>
          </Pressable>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,40,60,0.45)",
  },
  safe: { flex: 1 },
  overlay: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  /* Estado */
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconSuccess: { backgroundColor: "#4caf50" },
  iconFail: { backgroundColor: "#e05252" },
  iconText: { fontSize: 36, color: "#fff", fontWeight: "700" },
  statusLabel: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 2 },
  },
  /* Tarjeta */
  card: {
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 10,
  },
  cardHeader: {
    backgroundColor: "#7cd4d7",
    paddingVertical: 12,
    alignItems: "center",
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f3f4f",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
  },
  rowLabel: {
    fontSize: 13,
    color: "#607d8b",
    fontWeight: "600",
  },
  rowValue: {
    fontSize: 13,
    color: "#1a2e3a",
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4caf50",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeSuccess: { backgroundColor: "#e8f5e9" },
  badgeFail: { backgroundColor: "#fdecea" },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2e7d32",
  },
  note: {
    fontSize: 11,
    color: "#78909c",
    textAlign: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  /* Botones */
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryBtnText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 15,
  },
  ratingBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4caf50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  ratingBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
