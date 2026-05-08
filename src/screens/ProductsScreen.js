import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatCurrency } from "../utils/formatters";
import { fetchProductsFromMongo } from "../services/mongoService";

export default function ProductsScreen({
  navigation,
  products,
  onAddToCart,
  cartCount,
  currency,
  user,
}) {
  const [mongoProducts, setMongoProducts] = useState([]);

  const loadMongoProducts = useCallback(async () => {
    const result = await fetchProductsFromMongo(user?.email);
    if (result.ok) setMongoProducts(result.products);
  }, [user?.email]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadMongoProducts);
    return unsubscribe;
  }, [navigation, loadMongoProducts]);
  return (
    <ImageBackground
      source={require("../../assets/AgroAPP_Fondo_Pantalla.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Productos del campo</Text>
          <View style={styles.headerActions}>
            <Pressable onPress={() => navigation.navigate("CrearProducto")}>
              <Text style={styles.actionLink}>+ Crear</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Perfil")}>
              <Text style={styles.profileLink}>{user?.nombre || "Perfil"}</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
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

          {mongoProducts.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Mis productos</Text>
              <FlatList
                data={mongoProducts}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.productName}>{item.nombre}</Text>
                      <Text style={styles.price}>
                        Cant: {item.cantidad}  •  {item.estado || "Activo"}
                      </Text>
                    </View>
                    <Pressable
                      style={styles.editButton}
                      onPress={() =>
                        navigation.navigate("EditarProducto", { product: item })
                      }
                    >
                      <Text style={styles.editButtonText}>Editar</Text>
                    </Pressable>
                  </View>
                )}
              />
            </>
          )}
        </ScrollView>

        <Pressable
          style={styles.checkoutButton}
          onPress={() => navigation.navigate("Pago")}
        >
          <Text style={styles.checkoutText}>Ir a pagar ({cartCount})</Text>
        </Pressable>
      </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(242, 248, 243, 0.72)",
    paddingTop: 12,
  },
  scrollArea: {
    flex: 1,
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
  headerActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  actionLink: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 11,
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
  editButton: {
    backgroundColor: "#5fbec2",
    borderRadius: 13,
    width: 60,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    color: "#0f3f4f",
    fontWeight: "700",
    fontSize: 11,
  },
  sectionTitle: {
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 2,
    fontSize: 11,
    fontWeight: "700",
    color: "#0f3f4f",
  },
  checkoutButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4caf50",
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
