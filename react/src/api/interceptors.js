import { notification } from 'antd';
import instance from './axios';

// Attach Accept-Language for localization
instance.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['Accept-Language'] = 'ru';
  return config;
});

function extractErrorText(data) {
  if (!data) return 'Произошла ошибка запроса';
  if (typeof data === 'string') return data;
  if (data.detail && typeof data.detail === 'string') return data.detail;
  if (Array.isArray(data)) return data.map(String).join('\n');
  if (typeof data === 'object') {
    const parts = [];
    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (Array.isArray(val)) {
        parts.push(`${key}: ${val.join(', ')}`);
      } else if (typeof val === 'string') {
        parts.push(`${key}: ${val}`);
      } else if (val && typeof val === 'object') {
        parts.push(`${key}: ${extractErrorText(val)}`);
      }
    });
    if (parts.length) return parts.join('\n');
  }
  return 'Произошла ошибка запроса';
}

instance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const desc = extractErrorText(data);

    // Show notification for most errors
    notification.error({
      message: status ? `Ошибка ${status}` : 'Ошибка',
      description: desc,
      placement: 'topRight',
      duration: 4.5,
    });

    return Promise.reject(error);
  }
);
