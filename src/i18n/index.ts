import i18n from 'i18n'
import path from 'node:path'

i18n.configure({
  locales: ["en", "ko"],
  defaultLocale: "ko",
  directory: path.join(__dirname, "locales"),
  queryParameter: "lang", // Allows ?lang=fr
  cookie: "locale", // Saves user preference in a cookie
  autoReload: true, // Reload translations automatically
  syncFiles: true, // Sync changes
  register: global, // Allow global `__()` function
  objectNotation: true
})

export default i18n