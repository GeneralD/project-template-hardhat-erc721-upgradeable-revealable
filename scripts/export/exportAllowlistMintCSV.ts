import { BigNumber } from 'ethers'
import { writeFileSync } from 'fs'
import { join } from 'path'

import { Latest__SYMBOL__, latest__SYMBOL__Factory } from '../libs/const'
import { deployedProxy } from '../libs/deployedProxy'
import { allowlistedAddresses } from '../libs/envs'

async function main() {
    const __SYMBOL__ = await latest__SYMBOL__Factory
    const instance = __SYMBOL__.attach((await deployedProxy()).address) as Latest__SYMBOL__

    const data = await Promise.all(allowlistedAddresses.map(address => instance.allowListMemberMintCount(address)
        .then(balance => ({ address, balance }))
        .catch(_ => ({ address, balance: BigNumber.from(0) }))
    ))
    const csvBody = data
        .sort((lhs, rhs) => rhs.balance.toNumber() - lhs.balance.toNumber())
        .map(d => `${d.address},${d.balance}`)
        .join("\n")
    const csvHeader = "Address,Balance"
    const csv = `${csvHeader}\n${csvBody}`
    const exportPath = join(__dirname, "allowlist_mint_quantity.csv")
    console.info(`writing a file to ${exportPath}`)
    writeFileSync(exportPath, csv, { flag: "w" })
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})