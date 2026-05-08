import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { ENV } from "../config/env";
import { getWompiSignature, verifyWompiTransaction } from "../services/mongoService";

function buildWompiCheckoutUrl({
  publicKey,
  amountInCents,
  reference,
  signature,
  currency,
  customerData,
}) {
  const base = "https://checkout.wompi.co/pos/";
  const params = new URLSearchParams();
  params.set("public-key", publicKey);
  params.set("currency", currency || "COP");
  params.set("amount-in-cents", String(amountInCents));
  params.set("reference", reference);
  params.set("signature:integrity", signature);

  if (customerData?.email)
    params.set("customer-data:email", customerData.email);
  if (customerData?.fullName)
    params.set("customer-data:full-name", customerData.fullName);
  if (customerData?.phoneNumber) {
    params.set("customer-data:phone-number", customerData.phoneNumber);
    params.set("customer-data:phone-number-prefix", "+57");
  }
  if (customerData?.address) {
    params.set("shipping-address:address-line-1", customerData.address);
    params.set("shipping-address:country", "CO");
    params.set("shipping-address:city", customerData.city || "");
    params.set("shipping-address:region", customerData.region || "");
    params.set("shipping-address:phone-number", customerData.phoneNumber || "");
  }

  return base + "?" + params.toString();
}

export default function WompiWebViewScreen({ navigation, route }) {
  const { amountInCents, reference, customerData, onPayComplete } =
    route.params;
  const publicKey = ENV.WOMPI_PUBLIC_KEY;
  const isSandbox = ENV.WOMPI_ENV === "sandbox";

  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [loadingSignature, setLoadingSignature] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);
  const processingRef = useRef(false);

  useEffect(() => {
    (async () => {
      const result = await getWompiSignature(reference, amountInCents, "COP");
      if (!result.ok) {
        setError(result.reason || "No se pudo obtener la firma de Wompi");
        setLoadingSignature(false);
        return;
      }
      setCheckoutUrl(
        buildWompiCheckoutUrl({
          publicKey,
          amountInCents,
          reference,
          signature: result.signature,
          currency: "COP",
          customerData,
        })
      );
      setLoadingSignature(false);
    })();
  }, []);

  const handleNavigationChange = async (navState) => {
    const url = navState.url || "";
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (!idMatch) return;
    if (processingRef.current) return;

    processingRef.current = true;
    const transactionId = idMatch[1];

    setVerifying(true);
    const verified = await verifyWompiTransaction(transactionId);
    setVerifying(false);

    const finalStatus = verified.ok ? verified.status : "UNKNOWN";

    if (finalStatus === "APPROVED") {
      if (onPayComplete) {
        const receipt = await onPayComplete(
          transactionId,
          finalStatus,
          reference,
          amountInCents
        );
        navigation.replace("Recibo", { receipt });
      } else {
        navigation.replace("Recibo", {
          receipt: {
            receiptCode: reference,
            paymentMethod: "Wompi",
            status: "Aprobada",
            dateText: new Date().toLocaleString("es-CO"),
            total: Math.round(amountInCents / 100),
            mongoStatus: "Transaccion Wompi: " + transactionId,
          },
        });
      }
    } else if (finalStatus === "DECLINED") {
      processingRef.current = false;
      Alert.alert(
        "Pago rechazado",
        "La transaccion fue rechazada. Intenta con otro metodo de pago."
      );
    } else if (finalStatus === "VOIDED" || finalStatus === "ERROR") {
      processingRef.current = false;
      Alert.alert(
        "Pago no completado",
        "La transaccion no se completo. Intenta de nuevo."
      );
    } else if (finalStatus === "PENDING") {
      processingRef.current = false;
      Alert.alert(
        "Pago pendiente",
        "Tu pago esta siendo procesado. Te notificaremos cuando se confirme."
      );
    } else {
      processingRef.current = false;
      Alert.alert("Estado desconocido", "Estado: " + finalStatus);
    }
  };

  if (loadingSignature || verifying) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7cd4d7" />
        <Text style={styles.loadingText}>
          {verifying
            ? "Verificando transaccion..."
            : "Preparando pasarela de pago..."}
        </Text>
        {isSandbox && (
          <Text style={styles.sandboxBadge}>MODO SANDBOX - sin dinero real</Text>
        )}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>No se pudo iniciar el pago</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {isSandbox && (
        <View style={styles.sandboxBanner}>
          <Text style={styles.sandboxBannerText}>SANDBOX - Pruebas</Text>
        </View>
      )}
      <WebView
        source={{ uri: checkoutUrl }}
        style={styles.webview}
        originWhitelist={["*"]}
        onNavigationStateChange={handleNavigationChange}
        onShouldStartLoadWithRequest={(request) => {
          if (request.url === "about:srcdoc" || request.url === "about:blank") return false;
          return true;
        }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.webviewLoader}>
            <ActivityIndicator size="large" color="#7cd4d7" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f8f6" },
  webview: { flex: 1 },
  webviewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8f6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8f6",
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    color: "#0f3f4f",
    fontSize: 14,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b22222",
    marginBottom: 8,
  },
  errorText: {
    color: "#444",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  backButtonText: { color: "#0f3f4f", fontWeight: "700" },
  sandboxBadge: {
    marginTop: 10,
    fontSize: 11,
    color: "#b26000",
    fontWeight: "700",
    backgroundColor: "#fff3cd",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  sandboxBanner: {
    backgroundColor: "#fff3cd",
    paddingVertical: 4,
    alignItems: "center",
  },
  sandboxBannerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#b26000",
  },
});
