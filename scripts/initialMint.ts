import { ethers } from 'hardhat'

import { Latest__SYMBOL__, latest__SYMBOL__Factory } from './libs/const'
import { deployedProxy } from './libs/deployedProxy'

async function main() {
    const __SYMBOL__ = await latest__SYMBOL__Factory
    const instance = __SYMBOL__.attach((await deployedProxy()).address) as Latest__SYMBOL__

    if ((await instance.totalSupply()).gt(0)) throw new Error("already minted")

    const [deployer] = await ethers.getSigners()
    let nonce = await ethers.provider.getTransactionCount(deployer.address)

    // await instance.adminMintTo("0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 1, { nonce: nonce++ })
    // await instance.adminMintTo("0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 1, { nonce: nonce++ })
    // await instance.adminMintTo("0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 1, { nonce: nonce++ })
    // await instance.adminMintTo("0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", 1, { nonce: nonce++ })
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
