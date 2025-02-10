"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.parseSkipAndLimit = void 0;
exports.formatDate = formatDate;
const parseSkipAndLimit = (req, max) => {
    const skip = Math.max(parseInt(req.query.skip) || 0);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 0), max);
    return { skip, limit };
};
exports.parseSkipAndLimit = parseSkipAndLimit;
const render = (res, path, data) => {
    const payload = Object.assign({ currentLocale: res.locals.currentLocale || "en" }, (data !== null && data !== void 0 ? data : {}));
    return res.render(path, payload);
};
exports.render = render;
const localeMap = {
    en: 'en-US',
    ko: 'ko-KR'
};
function formatDate(date, currentLocale) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    const locale = localeMap[currentLocale] || 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}
