import { keccak256 } from 'ethers/lib/utils'
import { writeFileSync } from 'fs'
import { join } from 'path'

import { allowlistedAddresses } from '../libs/envs'

async function main() {
    const data = `[\n${allowlistedAddresses.map(keccak256).map(s => `    "${s}"`).join(",\n")}\n]`
    const exportPath = join(__dirname, "hashedAllowlist.json")
    console.info(`writing a file to ${exportPath}`)
    writeFileSync(exportPath, data, { flag: "w" })
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
