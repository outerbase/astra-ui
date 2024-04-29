import { watch } from 'chokidar'
import { spawn } from 'node:child_process'

const pathToWatch = './src'

// Function to handle the execution of the build command
function runBuildCommand() {
  const buildProcess = spawn('pnpm', ['compile'])

  buildProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  buildProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  buildProcess.on('error', (error) => {
    console.error(`Error: ${error.message}`)
  })

  buildProcess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`)
  })
}

const watcher = watch(pathToWatch, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
})

// Add event listeners.
let IS_READY = false
watcher
  .on('add', (path) => {
    IS_READY && console.log(`File ${path} has been added`)
    IS_READY && runBuildCommand()
  })
  .on('change', (path) => {
    IS_READY && console.log(`File ${path} has been changed`)
    IS_READY && runBuildCommand()
  })
  .on('unlink', (path) => {
    IS_READY && console.log(`File ${path} has been removed`)
    IS_READY && runBuildCommand()
  })

// More possible events.
watcher
  // .on('addDir', (path) => console.log(`Directory ${path} has been added`))
  // .on('unlinkDir', (path) => console.log(`Directory ${path} has been removed`))
  .on('error', (error) => console.log(`Watcher error: ${error}`))
  .on('ready', () => {
    console.log('Monitoring ', pathToWatch, 'for changes')
    IS_READY = true
    runBuildCommand()
  })
