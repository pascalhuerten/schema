const fs = require('node:fs')
const path = require('node:path')
const Ajv2020 = require('ajv/dist/2020')
const crypto = require('node:crypto')
const draft7MetaSchema = require('ajv/dist/refs/json-schema-draft-07.json')
const addFormats = require('ajv-formats')

const projectRoot = __dirname
const schemasDirectory = path.join(projectRoot, '../draft/schemas')
const cacheDirectory = path.join(projectRoot, '../.cache', 'remote-schemas')
const rootSchemaFile = path.resolve(
  projectRoot,
  process.argv[2] || '../draft/schemas/course.json'
)
const readJson = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))

function cachedSchemaFilename(uri) {
  const hash = crypto.createHash('sha256').update(uri).digest('hex')
  return path.join(cacheDirectory, `${hash}.json`)
}

async function loadRemoteSchema(uri) {
  const cacheFile = cachedSchemaFilename(uri)
  try {
    return readJson(cacheFile)
  } catch (error) {
    if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) throw error
  }

  const response = await fetch(uri)
  if (!response.ok) {
    throw new Error(
      `Unable to load schema ${uri}: ${response.status} ${response.statusText}`
    )
  }
  const schema = await response.json()
  fs.mkdirSync(cacheDirectory, { recursive: true })
  fs.writeFileSync(cacheFile, `${JSON.stringify(schema, null, 2)}\n`)
  return schema
}

const ajv = new Ajv2020({
  loadSchema: loadRemoteSchema,
  strict: false,
})
ajv.addMetaSchema(draft7MetaSchema)

for (const filename of fs.readdirSync(schemasDirectory)) {
  if (!filename.endsWith('.json')) continue
  const schemaFile = path.join(schemasDirectory, filename)
  if (path.resolve(schemaFile) === rootSchemaFile) continue
  ajv.addSchema(readJson(schemaFile))
}
addFormats(ajv)

async function main() {
  const validate = await ajv.compileAsync(readJson(rootSchemaFile))
  let passed = 0
  let failed = 0

  for (const [directory, expected] of [
    ['../draft/examples/valid', true],
    ['../draft/examples/invalid', false],
  ]) {
    for (const filename of fs.readdirSync(path.join(projectRoot, directory))) {
      if (!filename.endsWith('.json')) continue
      const data = readJson(path.join(projectRoot, directory, filename))
      const actual = validate(data)
      if (actual !== expected) {
        console.error(
          `${directory}/${filename} was expected to be ${
            expected ? 'valid' : 'invalid'
          }`
        )
        if (!actual) console.error(ajv.errorsText(validate.errors))
        process.exitCode = 1
        failed++
      } else {
        console.log(
          `${directory}/${filename} is ${
            expected ? 'valid' : 'invalid'
          } as expected`
        )
        passed++
      }
    }
  }

  console.log(`\nValidation completed. Passed: ${passed}, Failed: ${failed}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
