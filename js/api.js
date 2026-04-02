(function () {
  const config = window.__QUIZARENA_CONFIG__ || {};
  const origin = window.location.origin;
  const configuredBaseUrl = (config.apiBaseUrl || '').trim();
  const API_BASE_URL = configuredBaseUrl
    ? configuredBaseUrl.replace(/\/$/, '')
    : (origin && origin !== 'null' && origin !== 'file://')
      ? ''
      : 'http://127.0.0.1:8000';
  const DEFAULT_NETWORK_ERROR = 'QuizArena could not reach the server. Check your connection and try again.';
  const MOBILE_CONFIG_ERROR = 'This mobile build is missing the API server URL.';

  function getCapacitorRuntime() {
    if (typeof capacitorExports !== 'undefined') {
      if (!window.Capacitor && capacitorExports.Capacitor) {
        window.Capacitor = capacitorExports.Capacitor;
      }

      return {
        capacitor: capacitorExports.Capacitor || window.Capacitor || null,
        http: capacitorExports.CapacitorHttp || window.Capacitor?.Plugins?.CapacitorHttp || null
      };
    }

    return {
      capacitor: window.Capacitor || null,
      http: window.Capacitor?.Plugins?.CapacitorHttp || null
    };
  }

  function isNativePlatform() {
    const runtime = getCapacitorRuntime();
    return Boolean(runtime.capacitor && typeof runtime.capacitor.isNativePlatform === 'function' && runtime.capacitor.isNativePlatform());
  }

  function buildUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
  }

  function readHeader(headers, name) {
    if (!headers) return '';

    const target = name.toLowerCase();

    if (headers instanceof Headers) {
      return headers.get(name) || '';
    }

    const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === target);
    return entry ? entry[1] : '';
  }

  function buildError(status, payload) {
    let message;

    if (payload && typeof payload === 'object') {
      message = payload.detail || payload.message || payload.error || JSON.stringify(payload);
    } else if (payload !== null && payload !== undefined) {
      message = String(payload);
    } else {
      message = `Request failed with status ${status}`;
    }

    const error = new Error(message);
    error.status = status;
    error.payload = payload;
    return error;
  }

  function normalizePayload(status, contentType, payload) {
    if (status === 204) {
      return null;
    }

    if (typeof payload === 'string' && contentType.includes('application/json')) {
      try {
        return JSON.parse(payload);
      } catch (_error) {
        return payload;
      }
    }

    return payload;
  }

  async function parseFetchPayload(response) {
    const contentType = readHeader(response.headers, 'content-type');

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
      const networkError = new Error(DEFAULT_NETWORK_ERROR);
      networkError.status = 0;
      networkError.payload = { cause: error.message };
      throw networkError;
    }

    const { contentType, payload } = await parseFetchPayload(response);

    if (!response.ok) {
      throw buildError(response.status, payload);
    }

    return normalizePayload(response.status, contentType, payload);
  }

  async function requestWithNativeHttp(url, requestOptions) {
    if (!API_BASE_URL) {
      const configError = new Error(MOBILE_CONFIG_ERROR);
      configError.status = 0;
      configError.payload = null;
      throw configError;
    }

    const runtime = getCapacitorRuntime();
    if (!runtime.http || typeof runtime.http.request !== 'function') {
      return requestWithFetch(url, requestOptions);
    }

    let response;

    try {
      response = await runtime.http.request({
        method: requestOptions.method,
        url,
        headers: requestOptions.headers,
        data: requestOptions.rawBody,
        responseType: 'text'
      });
    } catch (error) {
      const networkError = new Error(DEFAULT_NETWORK_ERROR);
      networkError.status = 0;
      networkError.payload = { cause: error.message };
      throw networkError;
    }

    const contentType = readHeader(response.headers, 'content-type');
    const payload = normalizePayload(response.status, contentType, response.data);

    if (response.status < 200 || response.status >= 300) {
      throw buildError(response.status, payload);
    }

    return payload;
  }

  async function request(path, options = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      auth = false
    } = options;

    const requestHeaders = {
      ...headers
    };

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    const hasBody = body !== undefined;

    // If we are sending FormData (avatar uploads, etc) do not set JSON Content-Type.
    // Let the browser set `multipart/form-data; boundary=...`.
    if (hasBody && !isFormData && !requestHeaders['Content-Type'] && !requestHeaders['content-type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (auth && window.authClient?.getToken()) {
      requestHeaders.Authorization = `Bearer ${window.authClient.getToken()}`;
    }

    let requestBody = undefined;
    if (hasBody) {
      requestBody = isFormData ? body : JSON.stringify(body);
    }

    const url = buildUrl(path);
    const requestOptions = {
      method,
      headers: requestHeaders,
      body: hasBody ? requestBody : undefined,
      rawBody: hasBody ? body : undefined
    };

    if (isNativePlatform() && !isFormData) {
      return requestWithNativeHttp(url, requestOptions);
    }

    return requestWithFetch(url, requestOptions);
  }

  window.apiClient = {
    baseUrl: API_BASE_URL,
    isNative: isNativePlatform(),
    request,
    get(path, options = {}) {
      return request(path, { ...options, method: 'GET' });
    },
    post(path, body, options = {}) {
      return request(path, { ...options, method: 'POST', body });
    },
    patch(path, body, options = {}) {
      return request(path, { ...options, method: 'PATCH', body });
    },
    put(path, body, options = {}) {
      return request(path, { ...options, method: 'PUT', body });
    },
    delete(path, options = {}) {
      return request(path, { ...options, method: 'DELETE' });
    }
  };
})();
