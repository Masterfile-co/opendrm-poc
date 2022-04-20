import { TextEncoder } from "util";
import sha3 from 'js-sha3';

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

export const toHexString = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

export const toBase64 = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString("base64");

export const toBytes = (str: string): Uint8Array =>
  new TextEncoder().encode(str);

  export const keccakDigest = (m: Uint8Array): Uint8Array =>
  fromHexString(sha3.keccak_256(m)).slice(0, 32);