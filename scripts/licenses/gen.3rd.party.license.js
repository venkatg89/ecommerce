const fs = require('fs')

const packageJson = require('../../package.json')

const DONT_INCLUDE = ['my_bn', 'localytics-react-native', 'stream-buffers', 'react-native-bn-logger']

const licensesJsonFile = process.argv[2]
if (!licensesJsonFile) {
  console.error('No input filename')
  return
}

let licenses = require(licensesJsonFile)

console.log(`Loaded ${Object.keys(licenses).length} total entries.`)

const header = `
<html><head>
<meta charset="UTF-8">
<style>
h1 { font-size: 16; }
h2 { font-size: 14; }
p { font-size: 12; }
.entry { max-width: 768; margin-bottom: 32; padding: 8px; border: 0.5px solid grey; background-color: #F8F8F8; }
.bold { font-weight: bold; }
</style>
</head><body>
`
const footer = '</body></html>'
const title = '<h1>3rd Party Libraries</h1>'

const outputFilename = process.argv[3]
if (!outputFilename) {
  console.error('No output filename')
  return
}

const of = fs.openSync(outputFilename, 'w')

fs.writeSync(of, header)
fs.writeSync(of, title)

let str = ''

console.log('deps', packageJson.dependencies)
const onlyOneLevel = process.argv[4] === '--direct'
if (onlyOneLevel) {
  const keepOnly = {}
  Object.keys(licenses).forEach((key) => {
    Object.keys(packageJson.dependencies).forEach((toKeep) => {
      if (key.startsWith(`${toKeep}@`)) {
        keepOnly[key] = licenses[key]
      }
    })
  })
  licenses = keepOnly
}

Object.keys(licenses).forEach((key) => {
  DONT_INCLUDE.forEach((toDelete) => {
    if (key.startsWith(`${toDelete}@`)) {
      delete licenses[key]
    }
  })
})


Object.keys(licenses).forEach((key) => {
  const value = licenses[key]

  let licenseText = ''
  if (value.licenseFile && !value.licenseFile.toLowerCase().endsWith('readme.md')) {
    licenseText = fs.readFileSync(value.licenseFile, 'utf8')
  } else {
    licenseText = '(no separate license file included)'
  }

  str += '<div class=\'entry\'>'
  str += `<h2>${key}</h2>`
  if (value.publisher) str += `<p><span class='bold'>Publisher:</span> ${value.publisher}</p>`
  if (value.licenses) str += `<p><span class='bold'>License:</span> ${value.licenses}</p>`
  if (licenseText) {
    str += `<p><br /><span class='bold'>License Text</span><br /><br />${licenseText.replace(/\n/g, '<br/>')}</p>`
  }
  str += '</div>'
})

console.log(`Wrote ${Object.keys(licenses).length} total entries.`)

fs.writeSync(of, str)
fs.writeSync(of, footer)
fs.closeSync(of)
