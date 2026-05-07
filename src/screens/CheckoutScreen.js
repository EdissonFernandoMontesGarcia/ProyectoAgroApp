import { useMemo, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { formatCurrency } from "../utils/formatters";

const PAYMENT_METHODS = ["Tarjeta", "Nequi", "PSE"];

export default function CheckoutScreen({
  navigation,
  cart,
  currency,
  deliveryFee,
  onIncrease,
  onDecrease,
  onPay,
}) {
  const [selectedPayment, setSelectedPayment] = useState("Tarjeta");
  const [busy, setBusy] = useState(false);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );
  const total = subtotal + deliveryFee;

  const handlePay = async () => {
    if (!cart.length) return;
    setBusy(true);
    const receipt = await onPay(selectedPayment);
    setBusy(false);
    navigation.replace("Recibo", { receipt });
  };

  return (
    <ImageBackground
      source={require("../../assets/Fondo_Abstracto_Azul.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Medios de pago</Text>

        <View style={styles.methodsRow}>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method}
              style={[
                styles.methodButton,
                selectedPayment === method && styles.methodButtonSelected,
              ]}
              onPress={() => setSelectedPayment(method)}
            >
              <Text
                style={[
                  styles.methodText,
                  selectedPayment === method && styles.methodTextSelected,
                ]}
              >
                {method}
              </Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay productos agregados.</Text>
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.nombre}</Text>
                <Text style={styles.itemPrice}>
                  {formatCurrency(item.precio, currency)} x {item.cantidad}
                </Text>
              </View>
              <View style={styles.qtyBox}>
                <Pressable
                  onPress={() => onDecrease(item.id)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{item.cantidad}</Text>
                <Pressable
                  onPress={() => onIncrease(item.id)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Subtotal: {formatCurrency(subtotal, currency)}
          </Text>
          <Text style={styles.summaryText}>
            Domicilio: {formatCurrency(deliveryFee, currency)}
          </Text>
          <Text style={styles.totalText}>
            Total: {formatCurrency(total, currency)}
          </Text>
        </View>

        <Pressable
          style={[
            styles.payButton,
            (!cart.length || busy) && styles.payButtonDisabled,
          ]}
          onPress={handlePay}
          disabled={!cart.length || busy}
        >
          <Text style={styles.payText}>{busy ? "Procesando..." : "Pagar"}</Text>
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
    backgroundColor: "rgba(239, 244, 251, 0.72)",
    padding: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f3f4f",
    marginBottom: 9,
    textAlign: "center",
    backgroundColor: "#7cd4d7",
    borderRadius: 8,
    paddingVertical: 7,
  },
  methodsRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 8,
  },
  methodButton: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#8bcfd2",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  methodButtonSelected: {
    backgroundColor: "#7cd4d7",
    borderColor: "#7cd4d7",
  },
  methodText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 11,
  },
  methodTextSelected: {
    color: "#0f3f4f",
  },
  list: {
    gap: 8,
    paddingBottom: 10,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#4d6476",
  },
  itemRow: {
    borderWidth: 1,
    borderColor: "#9ecdd1",
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingHorizontal: 9,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f3b4f",
  },
  itemPrice: {
    color: "#3a5f79",
    marginTop: 1,
    fontSize: 11,
  },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7cd4d7",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 14,
  },
  qtyValue: {
    minWidth: 18,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 11,
  },
  summary: {
    borderTopWidth: 1,
    borderTopColor: "#b9dde0",
    paddingTop: 8,
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  summaryText: {
    color: "#244a66",
    fontSize: 12,
  },
  totalText: {
    color: "#143247",
    fontSize: 14,
    fontWeight: "700",
  },
  payButton: {
    marginTop: 10,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
  },
  payButtonDisabled: {
    opacity: 0.55,
  },
  payText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 12,
  },
});
