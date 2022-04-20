import { Bob, defaultConfiguration, SecretKey } from "@nucypher/nucypher-ts";
import { ChainId } from "@nucypher/nucypher-ts/build/main/src/types";
import { toUtf8Bytes, zeroPad } from "ethers/lib/utils";

export const middleEllipsis = (str: string) => {
  if (str.length > 35) {
    return str.slice(0, 20) + "..." + str.slice(-10);
  }
  return str;
};

export const toHexString = (bytes: Uint8Array): string =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

export const fromHexString = (hexString: string): Uint8Array => {
  const matches = hexString.match(/.{1,2}/g) ?? [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
};

export const toBase64 = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('base64');

export const fromBase64 = (str: string): Uint8Array =>
  Buffer.from(str, "base64");

export const fromBytes = (bytes: Uint8Array): string =>
  new TextDecoder().decode(bytes);

export const toSecretKey = (secret: string): SecretKey => {
  return SecretKey.fromBytes(zeroPad(toUtf8Bytes(secret), 32));
};

export const bobFromSecret = (secret: string): Bob => {
  return Bob.fromSecretKey(
    defaultConfiguration(ChainId.MUMBAI),
    toSecretKey(secret)
  );
};

export function delay(time: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, time * 1000));
}
