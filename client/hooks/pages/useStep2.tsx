// import { Web3Provider } from "@ethersproject/providers";
// import { useWeb3React } from "@web3-react/core";
// import { toUtf8Bytes, zeroPad } from "ethers/lib/utils";
// import { useRouter } from "next/router";
// import { Bob, SecretKey } from "@nucypher/nucypher-ts";
// import { useState } from "react";
// import { AbioticAliceManager__factory } from "types";
// import { ABIOTICALICE_ADDRESS, NuConfig } from "utils/constants";

// export function useStep2() {
//   const { push } = useRouter();
//   const { setStepDone, setNuUser, steps } = useOpenDRM();
//   const { provider } = useWeb3React();
//   const [secretKey, dispatchSecretKey] = useState<string | undefined>(
//     undefined
//   );
//   const [loading, setLoading] = useState(false);

//   const setSecretKey = (secretKey: string) => {
//     dispatchSecretKey(secretKey);
//   };

//   const registerUser = async () => {
//     if (!provider) {
//       alert("Please connect wallet");
//       return;
//     }
//     if (!secretKey) {
//       alert("Please enter secret key");
//       return;
//     }
//     setLoading(true);

//     const key = SecretKey.fromBytes(zeroPad(toUtf8Bytes(secretKey), 32));

//     const bob = Bob.fromSecretKey(NuConfig, key);

//     const aliceManager = AbioticAliceManager__factory.connect(
//       ABIOTICALICE_ADDRESS,
//       (provider as Web3Provider).getSigner()
//     );

//     // TODO: Error handling
//     const tx = await aliceManager.registerMe(
//       bob.verifyingKey.toBytes(),
//       bob.decryptingKey.toBytes()
//     );
//     await tx.wait();

//     localStorage.setItem("nu_sk", secretKey);
//     setNuUser(bob);
//     setLoading(false);
//     setStepDone(1);
//     push("/step3");
//   };

//   return {
//     secretKey,
//     setSecretKey,
//     registerUser,
//     loading,
//     done: steps[1].done,
//     active: steps[1].active,
//   };
// }

export default function useStep2() {}