export const allowlistedAddresses = [...new Set(
    process.env.ALLOWLIST_ADDRESSES?.split("\n").filter(address => address.startsWith("0x"))
)]
