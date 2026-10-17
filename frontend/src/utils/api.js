// Centralized Resilient Client API Utility with Configurable VITE_API_URL and Dynamic Server Discovery

const VITE_API_URL = import.meta.env?.VITE_API_URL;
const FALLBACK_PORTS = [60001, 6000, 6001, 6002, 6003, 6004, 5000, 5001, 8000, 8080];
let activeBaseUrl = VITE_API_URL || 'http://localhost:60001';
let isDiscovered = false;

export async function findWorkingBaseUrl() {
  if (isDiscovered && activeBaseUrl) {
    return activeBaseUrl;
  }

  // 1. First probe configured VITE_API_URL if present
  if (VITE_API_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(`${VITE_API_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'ok') {
          activeBaseUrl = VITE_API_URL;
          isDiscovered = true;
          return activeBaseUrl;
        }
      }
    } catch (e) {
      // Configured URL not responding, continue to fallback ports
    }
  }

  // 2. Probe candidate local ports dynamically
  for (const port of FALLBACK_PORTS) {
    const candidate = `http://localhost:${port}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 800);
      const res = await fetch(`${candidate}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'ok') {
          activeBaseUrl = candidate;
          isDiscovered = true;
          return candidate;
        }
      }
    } catch (e) {
      // Probe next candidate port
    }
  }

  return activeBaseUrl;
}

export async function apiFetch(endpoint, options = {}) {
  await findWorkingBaseUrl();
  const url = `${activeBaseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || `Server returned status ${response.status}`,
        status: response.status
      };
    }
    
    return data;
  } catch (error) {
    console.error(`API Fetch Error on ${url}:`, error);
    // Mark as undiscovered to trigger re-probe on next request
    isDiscovered = false;
    return {
      success: false,
      error: `Could not connect to backend server at ${activeBaseUrl}. Please verify backend is running.`,
      isNetworkError: true
    };
  }
}

// Student Auth APIs
export async function registerUser(userData) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

// Supports both loginUser({ email, password }) and loginUser(email, password)
export async function loginUser(arg1, arg2) {
  const credentials = (typeof arg1 === 'object' && arg1 !== null)
    ? arg1
    : { email: arg1, password: arg2 };

  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

// Interview Session APIs
export async function startInterviewSession(config) {
  return apiFetch('/api/interview/start', {
    method: 'POST',
    body: JSON.stringify(config)
  });
}

export async function submitInterviewAnswer(payload) {
  return apiFetch('/api/interview/answer', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function getAnswerHelp(payload) {
  return apiFetch('/api/interview/help', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function endInterviewSession(sessionId, userEmail) {
  return apiFetch('/api/interview/end', {
    method: 'POST',
    body: JSON.stringify({ sessionId, userEmail })
  });
}

// History & Report APIs (With Pagination Support)
export async function fetchHistory(email, page = 1, limit = 10) {
  const queryParts = [];
  if (email) queryParts.push(`email=${encodeURIComponent(email)}`);
  if (page) queryParts.push(`page=${page}`);
  if (limit) queryParts.push(`limit=${limit}`);
  
  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return apiFetch(`/api/history${queryString}`);
}

export async function fetchHistoryReport(id, email) {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiFetch(`/api/history/${id}${query}`);
}

export async function deleteHistoryReport(id, email) {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiFetch(`/api/history/${id}${query}`, {
    method: 'DELETE'
  });
}

// User Profile APIs
export async function fetchUserProfile(email) {
  return apiFetch(`/api/profile?email=${encodeURIComponent(email)}`);
}

export const fetchProfile = fetchUserProfile;

export async function updateUserProfile(profileData) {
  return apiFetch('/api/profile/update', {
    method: 'POST',
    body: JSON.stringify(profileData)
  });
}

export const updateProfile = updateUserProfile;

// HR, GD & Technical Practice Question APIs
export async function fetchHrQuestions() {
  return apiFetch('/api/questions/hr');
}

export async function fetchGdTopics() {
  return apiFetch('/api/questions/gd');
}

export async function fetchTechnicalQuestions() {
  return apiFetch('/api/questions/technical');
}

// PYQ (Previous Years Questions) APIs
export async function fetchPyqs() {
  return apiFetch('/api/pyq');
}

export async function addCustomPyq(pyqData) {
  return apiFetch('/api/pyq/add', {
    method: 'POST',
    body: JSON.stringify(pyqData)
  });
}

export async function uploadPyqFile(formData) {
  await findWorkingBaseUrl();
  const url = `${activeBaseUrl}/api/pyq/upload-file`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('PYQ file upload error:', error);
    return { success: false, error: 'Could not upload file to server.' };
  }
}

// Resume Scanner APIs
export async function uploadResumeFile(formData) {
  await findWorkingBaseUrl();
  const url = `${activeBaseUrl}/api/resume/upload`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    console.error('Resume upload error:', error);
    return { success: false, error: 'Could not upload resume to server.' };
  }
}

export const uploadResume = uploadResumeFile;

export async function parseResumeText(text, email) {
  return apiFetch('/api/resume/upload', {
    method: 'POST',
    body: JSON.stringify({ text, email })
  });
}
