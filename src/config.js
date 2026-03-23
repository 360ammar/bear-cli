import fs from "node:fs"
import path from "node:path"
import os from "node:os"

const DEFAULT_CONFIG_DIR = path.join(os.homedir(), ".config", "bear")

export function createConfig(configDir = DEFAULT_CONFIG_DIR) {
  const configPath = path.join(configDir, "config.json")

  function readConfig() {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf8"))
    } catch {
      return {}
    }
  }

  function writeConfig(data) {
    fs.mkdirSync(configDir, { recursive: true })
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2) + "\n")
  }

  function getToken() {
    if (process.env.BEAR_API_TOKEN) {
      return process.env.BEAR_API_TOKEN
    }
    return readConfig().token || null
  }

  function setToken(token) {
    const config = readConfig()
    config.token = token
    writeConfig(config)
  }

  return { getToken, setToken }
}

// Default instance for CLI usage
const config = createConfig()
export const getToken = config.getToken
export const setToken = config.setToken
