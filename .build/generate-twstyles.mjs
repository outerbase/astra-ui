#!/usr/bin/env node

import * as fs from 'fs'

// Function to extract command line arguments
function getCommandLineArguments() {
    const argv = {}
    process.argv.slice(2).forEach((arg) => {
        const [key, value] = arg.split('=')
        argv[key.replace(/^--/, '')] = value ?? true // Assign true for flags without explicit value
    })
    return argv
}
// Extract arguments
const { input, output, watch } = getCommandLineArguments()

const convert = () => {
    try {
        let contents

        try {
            contents = fs.readFileSync(input, 'utf8')
        } catch (e) {
            console.error(`Failed to read file ${input}. Might just not be created yet? retrying..`)
        }

        let cleanContents = contents.replaceAll('`', '')
        cleanContents = cleanContents.replaceAll('\\', '\\\\')

        const litContents = `
  import { css } from "lit";
  export const TWStyles = css\` /* THIS FILE IS GENERATED; DO NOT EDIT. */ ${cleanContents} \`
  `

        fs.writeFileSync(output, litContents)
        // console.log(`Wrote to file ${output}`)
    } catch (err) {
        console.error(err)
    }
}

if (watch) fs.watchFile(input, { interval: 1000 }, convert)
else convert()
