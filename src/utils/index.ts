import type { Request, Response } from "express";

export const parseSkipAndLimit = (req: Request, max: number) => {
  const skip = Math.max(parseInt(req.query.skip as string) || 0);
  const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 0), max)

  return { skip, limit }
}

export const render = (res: Response, path: string, data?: Record<string, unknown>) => {
  const payload = {
    ...{ currentLocale: res.locals.currentLocale || "en" },
    ...(data ?? {})
  }
  return res.render(path, payload)
}

const localeMap = {
  en: 'en-US',
  ko: 'ko-KR'
}

export function formatDate(date: string | Date, currentLocale: keyof typeof localeMap) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const locale = localeMap[currentLocale] || 'en-US';

  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}