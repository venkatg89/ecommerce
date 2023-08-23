/* Build Script */
/* Not part of app code, istead makes 'generated.json' app code imports */
/* eslint-disable import/no-dynamic-require, no-console */

const path = require('path')
const fs = require('fs')

const CONFIG_FOLDER = 'config'
const OUTPUT_CONFIG_FILE = 'generated.json'

const configs = {
  dev: 'dev.json',
  prod: 'prod.json',
}

// Get the config from params
const requestedConfigKey = process.argv[2]
const requestedConfigFile = configs[process.argv[2]]
if (!requestedConfigFile) {
  console.error('set-config.js: Please select a config from', Object.keys(configs), 'to set')
  process.exit(1)
}

// Read the config JSON cofile
console.log(`set-config.js: setting '${requestedConfigKey}'`)
const input = require(`./${requestedConfigFile}`)

// Replaces loaded config with environment variables, if present.
// Otherwise, just copies the config variable from input to outputConfig
let overrideCount = 0
const output = {}
Object.keys(input).forEach((key) => {
  if (process.env[key]) {
    console.log(`set-config.js: set from environment: '${key}'`)
    overrideCount += 1
  }
  output[key] = process.env[key] || input[key]
})

// Output as a JSON file
const outputJson = JSON.stringify(output, undefined, 2)
const outputFilename = `${CONFIG_FOLDER}${path.sep}${OUTPUT_CONFIG_FILE}`
fs.writeFileSync(outputFilename, outputJson, 'utf8')

let displayName = input.name
if (displayName.toLowerCase().startsWith('prod')) {
  displayName = `**** ${displayName} ****`
}

console.log(`set-config.js: wrote '${outputFilename}' using '${displayName}' with ${overrideCount} overrides from env.`)
