import sha3 from "js-sha3";

export const middleEllipsis = (str: string) => {
  if (str.length > 35) {
    return str.slice(0, 20) + "..." + str.slice(-10);
  }
  return str;
};

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.slice(2).match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

export const fromBytes = (bytes: Uint8Array): string =>
  new TextDecoder().decode(bytes);
