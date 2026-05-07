import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { formatCurrency } from "../utils/formatters";

export default function ProductsScreen({
  navigation,
  products,
  onAddToCart,
  cartCount,
  currency,
  user,
}) {
  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Productos del campo</Text>
          <Pressable onPress={() => navigation.navigate("Perfil")}>
            <Text style={styles.profileLink}>{user?.nombres || "Perfil"}</Text>
          </Pressable>
        </View>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.cardInfo}>
                <Text style={styles.productName}>{item.nombre}</Text>
                <Text style={styles.price}>
                  {formatCurrency(item.precio, currency)} / {item.unidad}
                </Text>
              </View>
              <Pressable
                style={styles.addButton}
                onPress={() => onAddToCart(item)}
              >
                <Text style={styles.addButtonText}>Agregar</Text>
              </Pressable>
            </View>
          )}
        />

        <Pressable
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("Pago")}
        >
          <Text style={styles.checkoutText}>Ir a pagar ({cartCount})</Text>
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
    backgroundColor: "rgba(242, 248, 243, 0.72)",
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#7cd4d7",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  profileLink: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 11,
  },
  list: {
    padding: 14,
    gap: 8,
  },
  card: {
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#9ccfd2",
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 8,
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  cardInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1b4047",
  },
  price: {
    marginTop: 1,
    color: "#2b5b63",
    fontSize: 11,
  },
  addButton: {
    backgroundColor: "#7cd4d7",
    borderRadius: 13,
    width: 74,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 11,
  },
  checkoutButton: {
    marginHorizontal: 16,
    marginBottom: 14,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7cd4d7",
  },
  checkoutText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 12,
  },
});
