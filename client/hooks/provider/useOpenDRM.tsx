import { OpenDRMContext } from "providers/OpenDRMContextProvider";
import { useContext } from "react";

export function useOpenDRM() {
  return useContext(OpenDRMContext);
}
