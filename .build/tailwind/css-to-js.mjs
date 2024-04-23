#!/usr/bin/env node

import * as fs from 'fs'
import yargs from 'yargs'

let input
let output
let watch
try {
    const argv = yargs(process.argv.slice(2)).argv
    input = argv.input ?? './TailwindGenerated.css'
    output = argv.output ?? './ReadyForLitimport.js'
    watch = argv.watch ?? false
} catch (e) {
    // console.log(`Error reading input/output parameters ${e}`)
}

// console.log(`Reading from file ${input}`)
// console.log(`Writing to ${output}`)

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
  export const TWStyles = css\` ${cleanContents} \`
  `

        fs.writeFileSync(output, litContents)
        // console.log(`Wrote to file ${output}`)
    } catch (err) {
        console.error(err)
    }
}

if (watch) fs.watchFile(input, { interval: 1000 }, convert)
else convert()
