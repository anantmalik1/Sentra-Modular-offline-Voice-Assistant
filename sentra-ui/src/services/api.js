const API_BASE = 'http://127.0.0.1:5000';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      state: 'OFFLINE',
      mode: 'OFFLINE',
      modules: {
        backend: 'DISCONNECTED',
        ai_brain: 'OFFLINE',
        voice_stt: 'UNAVAILABLE',
        voice_tts: 'UNAVAILABLE',
      },
    };
  }
}

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${API_BASE}/system/status`);
    if (!res.ok) throw new Error('Status failed');
    return await res.json();
  } catch (err) {
    return null;
  }
}

export async function sendCommand(text) {
  const res = await fetch(`${API_BASE}/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Command execution failed');
  }
  return await res.json();
}

export async function triggerVoiceListen() {
  const res = await fetch(`${API_BASE}/voice/listen`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || 'Voice listen request failed');
  }
  return await res.json();
}

export async function fetchHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    const data = await res.json();
    return data.history || [];
  } catch (err) {
    return [];
  }
}

export async function clearHistoryApi() {
  try {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'DELETE',
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
