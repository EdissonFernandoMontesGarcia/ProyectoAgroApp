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
