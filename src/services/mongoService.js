import { ENV } from "../config/env";

function normalizeApiBaseUrl(url) {
  if (!url) return "";
  return url.replace(/\/$/, "");
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("La API no respondió en 10 segundos");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function saveUserToApi(user) {
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) {
    return { saved: false, reason: "API no configurada" };
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
      return { saved: false, reason: `HTTP ${response.status}: ${text}` };
    }

    const data = await response.json();
    return { saved: Boolean(data.insertedId), insertedId: data.insertedId || null };
  } catch (error) {
    return { saved: false, reason: error.message };
  }
}

export async function getWompiSignature(reference, amountInCents, currency) {
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API no configurada" };

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
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
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
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API no configurada" };

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
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) {
    return { saved: false, reason: "API no configurada" };
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
  return saveUserToApi(user);
}

export async function loginFromMongo(email, password) {
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) {
    return { ok: false, reason: "API no configurada" };
  }

  try {
    const response = await fetchWithTimeout(`${baseUrl}/api/users/login`, {
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
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) {
    return { ok: false, reason: "API no configurada" };
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
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API no configurada" };

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
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) return { saved: false, reason: "API no configurada" };

  try {
    const response = await fetch(`${baseUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
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

export async function resetPasswordInMongo(email, newPassword) {
  const baseUrl = normalizeApiBaseUrl(ENV.API_BASE_URL);
  if (!baseUrl) return { ok: false, reason: "API no configurada" };
  try {
    const response = await fetch(`${baseUrl}/api/users/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), newPassword }),
    });
    const data = await response.json();
    if (!response.ok) return { ok: false, reason: data.message || "Error al restablecer" };
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error.message };
  }
}
