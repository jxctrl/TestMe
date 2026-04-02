import { Capacitor, CapacitorHttp } from "@capacitor/core";

const configuredBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").trim();
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");
const DEFAULT_NETWORK_ERROR = "QuizArena could not reach the server. Check your connection and try again.";
const MOBILE_CONFIG_ERROR = "This mobile build is missing the API server URL.";

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}

function readHeader(headers, name) {
  if (!headers) {
    return "";
  }

  const target = name.toLowerCase();

  if (headers instanceof Headers) {
    return headers.get(name) || "";
  }

  const match = Object.entries(headers).find(([key]) => key.toLowerCase() === target);
  return match?.[1] || "";
}

function buildErrorMessage(status, payload) {
  return payload && typeof payload === "object"
    ? payload.detail || payload.message || payload.error || JSON.stringify(payload)
    : payload || `Request failed with status ${status}`;
}

function normalizePayload(status, contentType, payload) {
  if (status === 204) {
    return null;
  }

  if (typeof payload === "string" && contentType.includes("application/json")) {
    try {
      return JSON.parse(payload);
    } catch (_error) {
      return payload;
    }
  }

  return payload;
}

async function parseFetchPayload(response) {
  const contentType = readHeader(response.headers, "content-type");

  if (response.status === 204) {
    return { contentType, payload: null };
  }

  const rawPayload = await response.text();
  return {
    contentType,
    payload: normalizePayload(response.status, contentType, rawPayload)
  };
}

async function requestWithFetch(url, requestOptions) {
  let response;

  try {
    response = await fetch(url, requestOptions);
  } catch (error) {
    throw new ApiError(DEFAULT_NETWORK_ERROR, 0, { cause: error.message });
  }

  const { contentType, payload } = await parseFetchPayload(response);

  if (!response.ok) {
    throw new ApiError(buildErrorMessage(response.status, payload), response.status, payload);
  }

  return normalizePayload(response.status, contentType, payload);
}

async function requestWithNativeHttp(url, requestOptions) {
  if (!API_BASE_URL) {
    throw new ApiError(MOBILE_CONFIG_ERROR, 0, null);
  }

  let response;

  try {
    response = await CapacitorHttp.request({
      method: requestOptions.method,
      url,
      headers: requestOptions.headers,
      data: requestOptions.body,
      responseType: "text"
    });
  } catch (error) {
    throw new ApiError(DEFAULT_NETWORK_ERROR, 0, { cause: error.message });
  }

  const contentType = readHeader(response.headers, "content-type");
  const payload = normalizePayload(response.status, contentType, response.data);

  if (response.status < 200 || response.status >= 300) {
    throw new ApiError(buildErrorMessage(response.status, payload), response.status, payload);
  }

  return payload;
}

export async function request(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    token
  } = options;

  const requestHeaders = { ...headers };
  const hasBody = body !== undefined;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (hasBody && !isFormData && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const url = buildUrl(path);
  const requestBody = hasBody ? (isFormData ? body : body) : undefined;
  const requestOptions = {
    method,
    headers: requestHeaders,
    body: hasBody ? (isFormData ? body : JSON.stringify(body)) : undefined
  };

  if (Capacitor.isNativePlatform() && !isFormData) {
    return requestWithNativeHttp(url, {
      ...requestOptions,
      body: requestBody
    });
  }

  return requestWithFetch(url, requestOptions);
}

export const api = {
  request,
  get(path, options = {}) {
    return request(path, { ...options, method: "GET" });
  },
  post(path, body, options = {}) {
    return request(path, { ...options, method: "POST", body });
  },
  put(path, body, options = {}) {
    return request(path, { ...options, method: "PUT", body });
  },
  patch(path, body, options = {}) {
    return request(path, { ...options, method: "PATCH", body });
  },
  delete(path, options = {}) {
    return request(path, { ...options, method: "DELETE" });
  }
};

export { API_BASE_URL };
