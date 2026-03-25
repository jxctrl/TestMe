(function () {
  const API_BASE_URL = window.location.origin && window.location.origin !== 'null'
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

    if (body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (auth && window.authClient?.getToken()) {
      requestHeaders.Authorization = `Bearer ${window.authClient.getToken()}`;
    }

    const response = await fetch(buildUrl(path), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const contentType = response.headers.get('content-type') || '';
    let payload = null;

    if (response.status !== 204) {
      payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    }

    if (!response.ok) {
      const message = payload?.detail || payload?.message || payload || `Request failed with status ${response.status}`;
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
    delete(path, options = {}) {
      return request(path, { ...options, method: 'DELETE' });
    }
  };
})();
