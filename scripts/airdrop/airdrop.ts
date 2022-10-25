import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { ethers } from 'hardhat'
import { join } from 'path'

import { latest__SYMBOL__Factory } from '../libs/const'
import { deployedProxy } from '../libs/deployedProxy'
import Row from '../libs/SnapshotCSVRow'

async function main() {
    const __SYMBOL__ = await latest__SYMBOL__Factory
    const instance = __SYMBOL__.attach((await deployedProxy()).address)
    await instance.deployed()

    const rows: Row[] = []
    createReadStream(join(__dirname, "holders.csv"))
        .pipe(csv())
        .on("data", data => rows.push(data))
        .on("error", err => console.error(err.message))
        .on("end", () => console.log(`Start airdrop to ${rows.length} addresses.`))

    const [deployer] = await ethers.getSigners()
    let nonce = await ethers.provider.getTransactionCount(deployer.address)

    for (const row of rows) {
        await instance.adminMintTo(row.address, row.balance, { nonce: nonce++ })
    }
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
