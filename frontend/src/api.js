const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, options = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data.message || data.meassage || data.error || 'Request error',
        data,
      };
    }
    return { ...data, status: response.status };
  } catch (error) {
    return { success: false, message: 'Unable to reach backend server.' };
  }
}

export function loginUser(payload) {
  return request('/user/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function registerUser(payload) {
  return request('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getDashboard(token) {
  return request('/dashboard', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getIncomes(token) {
  return request('/income/get', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getExpenses(token) {
  return request('/expense/get', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function addIncome(payload, token) {
  return request('/income/add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function addExpense(payload, token) {
  return request('/expense/add', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function deleteIncome(id, token) {
  return request(`/income/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function deleteExpense(id, token) {
  return request(`/expense/delete/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateIncome(id, payload, token) {
  return request(`/income/update/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updateExpense(id, payload, token) {
  return request(`/expense/update/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

async function downloadFile(path, token) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        message: data.message || data.error || 'Download error',
      };
    }

    const blob = await response.blob();
    return { success: true, blob };
  } catch (error) {
    return { success: false, message: 'Unable to reach backend server.' };
  }
}

export function downloadIncomeExcel(token) {
  return downloadFile('/income/downloadexcel', token);
}

export function downloadExpenseExcel(token) {
  return downloadFile('/expense/downloadexcel', token);
}

export function getCurrentUser(token) {
  return request('/user/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function updateProfile(payload, token) {
  return request('/user/profile', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export function updatePassword(payload, token) {
  return request('/user/password', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}


export function getAIInsights(token) {
  return request('/ai/insights', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
