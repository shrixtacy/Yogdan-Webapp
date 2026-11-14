const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('yogdan-access-token');
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('yogdan-access-token');
      window.dispatchEvent(new CustomEvent('yogdan-auth-expired'));
    }
    const error = new Error(body?.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

export const api = {
  register: (profile) => request('/auth/register', { method: 'POST', body: JSON.stringify(profile) }),
  requestOtp: (data) => request('/auth/request-otp', { method: 'POST', body: JSON.stringify(data) }),
  verifyOtp: (data) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(data) }),
  profile: () => request('/user/profile'),
  updateProfile: (patch) => request('/user/profile', { method: 'PUT', body: JSON.stringify(patch) }),
  requests: (mine = false) => request(`/requests?mine=${mine}`),
  createRequest: (input) => request('/requests', { method: 'POST', body: JSON.stringify(input) }),
  updateRequestStatus: (id, status) => request(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  respondToRequest: (id) => request(`/requests/${id}/respond`, { method: 'POST', body: JSON.stringify({}) }),
  records: () => request('/health/records'),
  saveAssessment: (data) => request('/health/assessments', { method: 'POST', body: JSON.stringify(data) }),
  addDocument: (data) => request('/health/documents', { method: 'POST', body: JSON.stringify(data) }),
  deleteDocument: (id) => request(`/health/documents/${id}`, { method: 'DELETE' }),
  actions: () => request('/actions'),
  addAction: (data) => request('/actions', { method: 'POST', body: JSON.stringify(data) }),
  posts: () => request('/community/posts'),
  createPost: (data) => request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (id) => request(`/community/posts/${id}/like`, { method: 'POST', body: JSON.stringify({}) }),
};
