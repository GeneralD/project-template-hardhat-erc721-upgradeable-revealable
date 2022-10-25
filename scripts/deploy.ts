import { parseEther } from 'ethers/lib/utils'
import { ethers, upgrades } from 'hardhat'

import { Latest__SYMBOL__, latest__SYMBOL__Factory } from './libs/const'
import { isProxyDeployed } from './libs/deployedProxy'

async function main() {
  if (await isProxyDeployed()) throw Error("Proxy has already been deployed! 'Upgrade' instead.")

  const __SYMBOL__ = await latest__SYMBOL__Factory
  const instance = await upgrades.deployProxy(__SYMBOL__) as Latest__SYMBOL__

  await instance.deployed()
  console.log("proxy deployed to: ", instance.address)

  const [deployer] = await ethers.getSigners()
  let nonce = await ethers.provider.getTransactionCount(deployer.address)

  // set variables
  await instance.setBaseURI("$$base url$$", { nonce: nonce++ }) // should end with a slash
  await instance.setMintLimit($$mint limit$$, { nonce: nonce++ })
  if (!await instance.isPublicMintPaused()) await instance.pausePublicMint({ nonce: nonce++ })
  await instance.setPublicPrice(parseEther("$$public price in ether$$"), { nonce: nonce++ }) // No public mint
  if (!await instance.isAllowlistMintPaused()) await instance.pauseAllowlistMint({ nonce: nonce++ })
  await instance.setAllowListPrice(parseEther("$$allowlist price in ether$$"), { nonce: nonce++ })
  await instance.setAllowlistedMemberMintLimit($$allowlist mint limit per owner$$, { nonce: nonce++ })
  await instance.setIsRevealed(false, { nonce: nonce++ })
  await instance.setRoyaltyFraction($$royalty fraction in percentage$$00, { nonce: nonce++ }) // $$royalty fraction in percentage$$%
  await instance.setRoyaltyReceiver("$$royalty receiver address$$", { nonce: nonce++ })
  await instance.setWithdrawalReceiver("$$withdrawal receiver address$$", { nonce: nonce++ })
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
