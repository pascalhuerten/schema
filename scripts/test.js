const fs = require('node:fs')
const path = require('node:path')
const Ajv2020 = require('ajv/dist/2020')
const crypto = require('node:crypto')
const draft7MetaSchema = require('ajv/dist/refs/json-schema-draft-07.json')
const addFormats = require('ajv-formats')

const projectRoot = __dirname
const schemasDirectory = path.join(projectRoot, '../draft/schemas')
const cacheDirectory = path.join(projectRoot, '../.cache', 'remote-schemas')
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

for (const filename of fs.readdirSync(schemasDirectory, { recursive: true })) {
  if (!filename.endsWith('.json')) continue
  const schemaFile = path.join(schemasDirectory, filename)
  ajv.addSchema(readJson(schemaFile))
}
addFormats(ajv)

async function main() {
  let passed = 0
  let failed = 0

  for (const suite of [
    {
      rootSchema: '../draft/schemas/course.json',
      directories: [
        ['../draft/examples/course/valid', true],
        ['../draft/examples/course/invalid', false],
      ],
    },
    {
      rootSchema: '../draft/schemas/api/catalogFeed.json',
      directories: [
        ['../draft/examples/catalog/valid', true],
        ['../draft/examples/catalog/invalid', false],
      ],
    },
    {
      rootSchema: '../draft/schemas/program.json',
      directories: [
        ['../draft/examples/program/valid', true],
        ['../draft/examples/program/invalid', false],
      ],
    },
  ]) {
    const rootSchema = readJson(path.resolve(projectRoot, suite.rootSchema))
    const validate = await ajv.compileAsync({ $ref: rootSchema.$id })

    for (const [directory, expected] of suite.directories) {
      for (const filename of fs.readdirSync(path.join(projectRoot, directory))) {
        if (!filename.endsWith('.json')) continue
        const data = readJson(path.join(projectRoot, directory, filename))
        const actual = validate(data)
        if (actual !== expected) {
          console.error(
            `${directory}/${filename} was expected to be ${expected ? 'valid' : 'invalid'
            }`
          )
          if (!actual) console.error(ajv.errorsText(validate.errors))
          process.exitCode = 1
          failed++
        } else {
          console.log(
            `${directory}/${filename} is ${expected ? 'valid' : 'invalid'
            } as expected`
          )
          passed++
        }
      }
    }
  }

  console.log(`\nValidation completed. Passed: ${passed}, Failed: ${failed}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
