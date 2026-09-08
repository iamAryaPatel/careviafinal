import dotenv from 'dotenv';
dotenv.config();

const parseJson = (value, fallback) => { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } };

export const crawlerConfig = {
  userAgent: process.env.CRAWLER_USER_AGENT || 'CarviaJobIndexer/1.0 (+https://example.com/crawler; contact=ops@example.com)',
  minDelayMs: Number(process.env.CRAWLER_MIN_DELAY_MS || 1200),
  retries: Number(process.env.CRAWLER_RETRIES || 2),
  timeoutMs: Number(process.env.CRAWLER_TIMEOUT_MS || 12000),
  enabled: process.env.CRAWLER_ENABLED === 'true',
  scheduleMinutes: Number(process.env.CRAWLER_SCHEDULE_MINUTES || 60),
  sources: parseJson(process.env.CRAWLER_SOURCES_JSON, [
    { id: 'greenhouse-demo', type: 'greenhouse', boardToken: process.env.GREENHOUSE_BOARD_TOKEN, enabled: Boolean(process.env.GREENHOUSE_BOARD_TOKEN), intervalMinutes: 60 },
    { id: 'lever-demo', type: 'lever', site: process.env.LEVER_SITE, enabled: Boolean(process.env.LEVER_SITE), intervalMinutes: 60 },
  ]),
};

export const validateSource = (source) => {
  if (!source?.id || !source?.type) throw new Error('A source requires id and type');
  if (!['greenhouse', 'lever', 'static-html', 'playwright'].includes(source.type)) throw new Error(`Unsupported source type: ${source.type}`);
  if (source.type === 'greenhouse' && !source.boardToken) throw new Error('Greenhouse source requires boardToken');
  if (source.type === 'lever' && !source.site) throw new Error('Lever source requires site');
  if (['static-html', 'playwright'].includes(source.type) && !source.url) throw new Error(`${source.type} source requires url`);
  return source;
};
