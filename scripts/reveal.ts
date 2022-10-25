import { ethers } from 'hardhat'

import { Latest__SYMBOL__, latest__SYMBOL__Factory } from './libs/const'
import { deployedProxy } from './libs/deployedProxy'

async function main() {
    const __SYMBOL__ = await latest__SYMBOL__Factory
    const instance = __SYMBOL__.attach((await deployedProxy()).address) as Latest__SYMBOL__

    if ((await instance.isRevealed())) throw new Error("already revealed")

    const [deployer] = await ethers.getSigners()
    let nonce = await ethers.provider.getTransactionCount(deployer.address)

    await instance.setKeccakPrefix("MJ_", { nonce: nonce++ })
    await instance.setIsRevealed(true, { nonce: nonce++ })
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
