import { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import ReceiptScreen from "./src/screens/ReceiptScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CreateProductScreen from "./src/screens/CreateProductScreen";
import EditProductScreen from "./src/screens/EditProductScreen";
import WompiWebViewScreen from "./src/screens/WompiWebViewScreen";
import RatingScreen from "./src/screens/RatingScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import { products } from "./src/data/products";
import { mockUser } from "./src/data/mockUser";
import { ENV } from "./src/config/env";
import { saveOrderToMongo, saveUserToMongo, loginFromMongo, saveProductToMongo } from "./src/services/mongoService";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const cartCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.cantidad, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
    [cart]
  );

  const handleLogin = async (email, password) => {
    const result = await loginFromMongo(email, password);
    if (result.ok) {
      setUser(result.user);
      return { ok: true };
    }
    return { ok: false, reason: result.reason };
  };

  const handleRegister = async (form) => {
    setUser({ ...mockUser, ...form });

    const mongoResult = await saveUserToMongo({
      ...form,
      createdAt: new Date().toISOString(),
    });

    return mongoResult;
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const increaseQty = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const decreaseQty = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, cantidad: Math.max(item.cantidad - 1, 0) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  const handleSaveProduct = async (product) => {
    return await saveProductToMongo(product);
  };

  const handleWompiPayComplete = async (transactionId, status, reference, amountInCents) => {
    const total = Math.round(amountInCents / 100);
    const now = new Date();
    const order = {
      usuario: {
        nombre: user?.nombre || "Cliente",
        apellidos: user?.apellidos || "",
        email: user?.email || "",
        celular: user?.celular || "",
        ciudad: user?.ciudad || "",
        direccion: user?.direccion || "",
        tipoUsuario: user?.tipoUsuario || "cliente",
      },
      productos: cart.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      subtotal,
      domicilio: ENV.DELIVERY_FEE,
      total,
      paymentMethod: "Wompi",
      wompiTransactionId: transactionId,
      wompiReference: reference,
      status: "Aprobada",
      createdAt: now.toISOString(),
    };

    const mongoResult = await saveOrderToMongo(order);
    setCart([]);

    return {
      receiptCode: reference,
      paymentMethod: "Wompi",
      status: "Aprobada",
      dateText: now.toLocaleString("es-CO"),
      total,
      mongoStatus: mongoResult.saved
        ? `Orden guardada (Tx: ${transactionId})`
        : "Orden guardada localmente",
    };
  };

  const handlePay = async (paymentMethod) => {
    const total = subtotal + ENV.DELIVERY_FEE;
    const now = new Date();
    const order = {
      usuario: {
        nombre: user?.nombre || user?.nombres || "Cliente",
        apellidos: user?.apellidos || "",
        email: user?.email || "",
        celular: user?.celular || "",
        ciudad: user?.ciudad || "",
        direccion: user?.direccion || "",
        tipoUsuario: user?.tipoUsuario || "cliente",
      },
      productos: cart.map((item) => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
      })),
      subtotal,
      domicilio: ENV.DELIVERY_FEE,
      total,
      paymentMethod,
      status: "Aprobada",
      createdAt: now.toISOString(),
    };

    const mongoResult = await saveOrderToMongo(order);
    const receipt = {
      receiptCode: `AGRO-${now.getTime()}`,
      paymentMethod,
      status: order.status,
      dateText: now.toLocaleString("es-CO"),
      total,
      mongoStatus: mongoResult.saved
        ? "Orden guardada en MongoDB"
        : "Orden guardada localmente (demo)",
    };

    setCart([]);
    return receipt;
  };

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: "#7cd4d7" },
          headerTintColor: "#0e2f3a",
          headerTitleStyle: { fontWeight: "700", fontSize: 15 },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Login"
          options={{ title: "Ingreso", headerShown: false }}
        >
          {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>
        <Stack.Screen name="Registro" options={{ title: "Registro" }}>
          {(props) => (
            <RegisterScreen {...props} onRegister={handleRegister} />
          )}
        </Stack.Screen>
        <Stack.Screen name="RecuperarContrasena" options={{ title: "Recuperar Contraseña" }}>
          {(props) => <ForgotPasswordScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Perfil" options={{ title: "Perfil" }}>
          {(props) => <ProfileScreen {...props} user={user} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="Productos" options={{ title: "Productos" }}>
          {(props) => (
            <ProductsScreen
              {...props}
              products={products}
              onAddToCart={addToCart}
              cartCount={cartCount}
              currency={ENV.CURRENCY}
              user={user}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Pago" options={{ title: "Pago" }}>
          {(props) => (
            <CheckoutScreen
              {...props}
              cart={cart}
              currency={ENV.CURRENCY}
              deliveryFee={ENV.DELIVERY_FEE}
              onIncrease={increaseQty}
              onDecrease={decreaseQty}
              onRemove={removeFromCart}
              onPay={handlePay}
              user={user}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Recibo" options={{ title: "Comprobante" }}>
          {(props) => <ReceiptScreen {...props} currency={ENV.CURRENCY} />}
        </Stack.Screen>
        <Stack.Screen name="CrearProducto" options={{ title: "Crear Producto" }}>
          {(props) => (
            <CreateProductScreen
              {...props}
              user={user}
              onSaveProduct={handleSaveProduct}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="EditarProducto" options={{ title: "Editor de Producto" }}>
          {(props) => <EditProductScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="WompiWebView" options={{ title: "Pagar con Wompi" }}>
          {(props) => (
            <WompiWebViewScreen
              {...props}
              onPayComplete={handleWompiPayComplete}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Calificacion" options={{ title: "Calificación" }}>
          {(props) => <RatingScreen {...props} user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
