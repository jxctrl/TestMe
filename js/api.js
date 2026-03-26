(function () {
  const origin = window.location.origin;
  const API_BASE_URL = (origin && origin !== 'null' && origin !== 'file://')
    ? ''
    : 'http://127.0.0.1:8000';

  function buildUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
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

    const response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: hasBody ? requestBody : undefined
    });

    const contentType = response.headers.get('content-type') || '';
    let payload = null;

    if (response.status !== 204) {
      payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    }

    if (!response.ok) {
      let message;
      if (payload && typeof payload === 'object') {
        // FastAPI often returns { "detail": "..." } or { "message": "..." }
        message = payload.detail || payload.message || payload.error || JSON.stringify(payload);
      } else if (payload !== null && payload !== undefined) {
        message = String(payload);
      } else {
        message = `Request failed with status ${response.status}`;
      }
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    return payload;
  }

  window.apiClient = {
    baseUrl: API_BASE_URL,
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