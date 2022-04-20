import { Enrico, PublicKey } from "nucypher-ts";

export interface IEnrico {
  encryptingKey: PublicKey;
}

export function useEnrico(props: IEnrico) {
  
  const encryptMessage = (plaintext: Uint8Array | string) => {
    const enrico = new Enrico(props.encryptingKey);
    return enrico.encryptMessage(plaintext);
  };

  return { encryptMessage };
}
