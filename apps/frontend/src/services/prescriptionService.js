import { api } from './api';

export async function uploadPrescription(file, language = 'en', onProgress) {
  const form = new FormData();
  form.append('image', file);
  form.append('language', language);
  const { data } = await api.post('/prescriptions', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 180000,
    onUploadProgress: (evt) => onProgress?.(Math.round((evt.loaded * 100) / (evt.total || 1))),
  });
  return data.data.prescription;
}

export async function listPrescriptions(page = 1, limit = 10, status) {
  const { data } = await api.get('/prescriptions', { params: { page, limit, status } });
  return data.data;
}

export async function getPrescription(id) {
  const { data } = await api.get(`/prescriptions/${id}`);
  return data.data.prescription;
}

export async function deletePrescription(id) {
  const { data } = await api.delete(`/prescriptions/${id}`);
  return data.data;
}
