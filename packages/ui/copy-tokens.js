const https = require('https')
const fs = require('fs')

/*
 * Branch to target in GitHub repo
 */
const branch = 'feat/new-components'
// using Math.random() in a param as GitHub caches raw content
// const url = `https://raw.githubusercontent.com/MildTomato/supabase-design-tokens/${branch}/tokens.json?e=${Math.random()}`
const baseUrl = `https://raw.githubusercontent.com/MildTomato/supabase-design-tokens/${branch}/tokens/`

/*
 * Files that need to be copied over from Tokens repo
 */
const TOKEN_FILES_METADATA = [
  // figma tokens misc config files
  { fileName: '$metadata.json', type: 'config' },
  { fileName: '$themes.json', type: 'config' },
  // source files
  { fileName: 'global.json', type: 'source' },
  { fileName: 'global-two.json', type: 'source' },
  // semantic
  { fileName: 'typography.json', type: 'semantic' },
  // themes
  { fileName: 'root.json', type: 'theme' }, // root theme
  { fileName: 'light.json', type: 'theme' },
  { fileName: 'darker-dark.json', type: 'theme' },
]

const PATHS = {
  config: 'config/',
  source: 'source/',
  theme: 'themes/',
  semantic: 'semantic/',
}

async function getTokensFile() {
  const promises = TOKEN_FILES_METADATA.map((tokenMetadata, i) => {
    return new Promise((resolve, reject) => {
      https
        .get(baseUrl + tokenMetadata.fileName, (res) => {
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })
          res.on('end', () => {
            fs.writeFile(
              `./tokens/${PATHS[tokenMetadata.type]}${tokenMetadata.fileName}`,
              data,
              'utf8',
              () => {}
            )
            resolve(data)
          })
        })
        .on('error', (err) => {
          reject(err)
        })
    })
  })

  await Promise.all(promises)
}

async function copyFiles() {
  console.log('Copying token files... \n')
  console.log('branch to pull is:', branch)
  try {
    await getTokensFile()
  } catch (error) {
    console.error(error)
  }
}

copyFiles()
