import axios from 'axios';
import { crawlerConfig } from './config.js';

const nextAllowedAt = new Map();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function rateLimitedRequest(url, options = {}) {
  const origin = new URL(url).origin;
  const wait = Math.max(0, (nextAllowedAt.get(origin) || 0) - Date.now());
  if (wait) await sleep(wait);
  nextAllowedAt.set(origin, Date.now() + crawlerConfig.minDelayMs);
  let lastError;
  for (let attempt = 0; attempt <= crawlerConfig.retries; attempt += 1) {
    try {
      return await axios.get(url, { timeout: crawlerConfig.timeoutMs, headers: { 'User-Agent': crawlerConfig.userAgent, Accept: 'application/json,text/html;q=0.9,*/*;q=0.5' }, ...options });
    } catch (error) {
      lastError = error;
      const status = error.response?.status;
      if (status && status < 500 && status !== 429) throw error;
      if (attempt < crawlerConfig.retries) await sleep(2 ** attempt * 750);
    }
  }
  throw lastError;
}
