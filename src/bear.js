import { execFile } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const URLHOOK_PATH = require.resolve("urlhook/bin/urlhook")

export function buildBearUrl(action, params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      const value = typeof v === "boolean" ? (v ? "yes" : "no") : String(v)
      return `${encodeURIComponent(k)}=${encodeURIComponent(value)}`
    })
    .join("&")

  const base = `bear://x-callback-url/${action}`
  return query ? `${base}?${query}` : base
}

export function formatTitle(title) {
  if (!title || !title.trim()) return "(untitled)"
  return title.replace(/^#+\s*/, "")
}

export function callBear(action, params = {}, options = {}) {
  const { timeoutMs = 10000 } = options
  const timeoutSec = Math.ceil(timeoutMs / 1000)

  const allParams = { ...params, show_window: "no" }
  const url = buildBearUrl(action, allParams)

  return new Promise((resolve, reject) => {
    execFile(
      URLHOOK_PATH,
      [url, "--timeout", String(timeoutSec)],
      { timeout: timeoutMs + 2000 },
      (error, stdout, stderr) => {
        if (error) {
          try {
            const errResult = JSON.parse(stderr || stdout)
            const msg = errResult.params?.errorMessage || error.message
            return reject(new Error(msg))
          } catch {
            return reject(new Error(stderr || error.message))
          }
        }

        try {
          const result = JSON.parse(stdout)
          resolve(result.params || {})
        } catch {
          resolve({})
        }
      },
    )
  })
}
