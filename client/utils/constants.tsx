export const NuConfig = {
  porterUri: "https://porter-lynx.nucypher.community/",
};

export const OPENDRM721_ADDRESS = process.env.NEXT_PUBLIC_OPENDRM721_ADDRESS as string;

export const ABIOTICALICE_ADDRESS = process.env
  .NEXT_PUBLIC_ABIOTIC_ALICE_MANAGER_ADDRESS as string;

// Policy defaults, will make this dynamic user inputs later
export const THRESHOLD = 2;
export const SHARES = 3;
export const PAYMENT_PERIODS = 3;
