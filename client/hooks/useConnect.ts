import { metamask } from "utils/connectors";
import { mumbai } from "utils/config";

export function useConnect() {
  const connectMetamask = () => {
    metamask.activate(mumbai);
  };

  return { connectMetamask };
}
