import { ENV } from "../config/env";

function normalizeLocalBaseUrl(url) {
  if (!url) return "";
  return url.replace(/\/$/, "");
}

async function saveUserToLocalApi(user) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  console.log("[saveUserToLocalApi] baseUrl:", baseUrl);
  console.log("[saveUserToLocalApi] payload:", JSON.stringify(user));
  if (!baseUrl) {
    return { saved: false, reason: "API local no configurada" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const text = await response.text();
      console.log("[saveUserToLocalApi] error HTTP:", response.status, text);
      return { saved: false, reason: `HTTP ${response.status}: ${text}` };
    }

    const data = await response.json();
    console.log("[saveUserToLocalApi] insertedId:", data.insertedId);
    return { saved: Boolean(data.insertedId), insertedId: data.insertedId || null };
  } catch (error) {
    console.log("[saveUserToLocalApi] excepcion:", error.message);
    return { saved: false, reason: error.message };
  }
}

export async function getWompiSignature(reference, amountInCents, currency) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API local no configurada" };

  try {
    const response = await fetch(`${baseUrl}/api/wompi/signature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, amountInCents, currency }),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, reason: data.error || "Error servidor" };
    return { ok: true, signature: data.signature };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

/**
 * Consulta el estado final de una transacción en la API de Wompi.
 * Usa la URL base correspondiente al ambiente (sandbox o producción)
 * según el prefijo de la llave pública configurada en .env.
 *
 * Sandbox:    https://sandbox.wompi.co/v1/transactions/:id
 * Producción: https://production.wompi.co/v1/transactions/:id
 */
export async function verifyWompiTransaction(transactionId) {
  const apiBase = ENV.WOMPI_API_BASE_URL;
  try {
    const response = await fetch(`${apiBase}/transactions/${transactionId}`);
    if (!response.ok) {
      const text = await response.text();
      return { ok: false, reason: `HTTP ${response.status}: ${text}` };
    }
    const data = await response.json();
    const tx = data?.data;
    return {
      ok: true,
      status: tx?.status || "UNKNOWN",
      amountInCents: tx?.amount_in_cents,
      reference: tx?.reference,
      paymentMethodType: tx?.payment_method_type,
      finalizedAt: tx?.finalized_at,
      transaction: tx,
    };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

export async function fetchProductsFromMongo(vendedor) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) return { ok: false, products: [] };

  try {
    const url = vendedor
      ? `${baseUrl}/api/products?vendedor=${encodeURIComponent(vendedor)}`
      : `${baseUrl}/api/products`;
    const response = await fetch(url);
    const data = await response.json();
    return { ok: response.ok, products: data.products || [] };
  } catch (error) {
    return { ok: false, products: [], reason: error.message };
  }
}

export async function updateProductInMongo(id, updates) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API local no configurada" };

  try {
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, reason: data.message };
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

export async function saveProductToMongo(product) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) {
    return { saved: false, reason: "API local no configurada" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    const data = await response.json();

    if (!response.ok) {
      return { saved: false, reason: data.message || "Error al guardar producto" };
    }

    return { saved: Boolean(data.insertedId), insertedId: data.insertedId || null };
  } catch (error) {
    return { saved: false, reason: error.message };
  }
}

export async function saveUserToMongo(user) {
  const localApiResult = await saveUserToLocalApi(user);
  if (localApiResult.saved) {
    return localApiResult;
  }

  const {
    DATA_API_URL,
    API_KEY,
    DATA_SOURCE,
    DATABASE,
    USERS_COLLECTION,
  } = ENV.MONGO;

  if (!DATA_API_URL || !API_KEY) {
    return {
      saved: false,
      reason:
        localApiResult.reason || "MongoDB no configurado en API local ni Data API",
    };
  }

  try {
    const response = await fetch(`${DATA_API_URL}/action/insertOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection: USERS_COLLECTION,
        document: {
          ...user,
          createdAt: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { saved: false, reason: text };
    }

    const data = await response.json();
    return {
      saved: Boolean(data.insertedId),
      insertedId: data.insertedId || null,
    };
  } catch (error) {
    return { saved: false, reason: error.message };
  }
}

export async function loginFromMongo(email, password) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) {
    return { ok: false, reason: "API local no configurada" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, reason: data.message || "Error al iniciar sesión" };
    }

    return { ok: true, user: data.user };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

export async function changePasswordInMongo(email, currentPassword, newPassword) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) {
    return { ok: false, reason: "API local no configurada" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/users/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, reason: data.message || "Error al cambiar contraseña" };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

export async function saveRatingToMongo(rating) {
  const baseUrl = normalizeLocalBaseUrl(ENV.LOCAL_API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API local no configurada" };

  try {
    const response = await fetch(`${baseUrl}/api/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rating),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, reason: data.message || "Error servidor" };
    return { ok: true, insertedId: data.insertedId };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}

export async function saveOrderToMongo(order) {
  const { DATA_API_URL, API_KEY, DATA_SOURCE, DATABASE, ORDERS_COLLECTION } =
    ENV.MONGO;

  if (!DATA_API_URL || !API_KEY) {
    return { saved: false, reason: "MongoDB no configurado en .env" };
  }

  try {
    const response = await fetch(`${DATA_API_URL}/action/insertOne`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        dataSource: DATA_SOURCE,
        database: DATABASE,
        collection: ORDERS_COLLECTION,
        document: order,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { saved: false, reason: text };
    }

    const data = await response.json();
    return {
      saved: Boolean(data.insertedId),
      insertedId: data.insertedId || null,
    };
  } catch (error) {
    return { saved: false, reason: error.message };
  }
}
