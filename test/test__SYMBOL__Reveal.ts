import { expect } from 'chai'
import { keccak256, toUtf8Bytes } from 'ethers/lib/utils'
import { ethers, upgrades } from 'hardhat'
import { describe, it } from 'mocha'

import { Latest__SYMBOL__, latest__SYMBOL__Factory } from './const'

describe("Reveal __SYMBOL__", () => {
    it("Owner is allowed to trigger reveal", async () => {
        const [] = await ethers.getSigners()

        const __SYMBOL__ = await latest__SYMBOL__Factory
        const instance = await upgrades.deployProxy(__SYMBOL__) as Latest__SYMBOL__

        await expect(instance.setIsRevealed(true))
            .to.emit(instance, "Revealed")
            .withArgs(true)

        await expect(instance.setIsRevealed(false))
            .to.emit(instance, "Revealed")
            .withArgs(false)
    })

    it("Other than owner is allowed to trigger reveal", async () => {
        const [, mallory] = await ethers.getSigners()

        const __SYMBOL__ = await latest__SYMBOL__Factory
        const instance = await upgrades.deployProxy(__SYMBOL__) as Latest__SYMBOL__

        await expect(instance.connect(mallory).setIsRevealed(true))
            .to.be.revertedWith("Ownable: caller is not the owner")
    })

    it("Check URIs before and after reveal", async () => {
        const __SYMBOL__ = await latest__SYMBOL__Factory
        const instance = await upgrades.deployProxy(__SYMBOL__) as Latest__SYMBOL__

        await instance.setBaseURI("https://sample.com/")
        await instance.setKeccakPrefix("Test_")

        // mint tokens in order not to be reverted when tokenURL()
        await instance.setMintLimit(20)
        await instance.adminMint(10)

        expect(await instance.tokenURI(10)).to.equal("https://sample.com/seed.json")

        await instance.setIsRevealed(true)

        const hash = keccak256(toUtf8Bytes("Test_10"))
        expect(hash.startsWith("0x")).to.be.true

        const name = hash.substring(2)
        expect(await instance.tokenURI(10)).to.equal(`https://sample.com/${name}.json`)
    })
})