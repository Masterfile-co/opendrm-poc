import { Bob } from "nucypher-ts";
import { useState } from "react";

export function useNuUser() {
  const [nuUser, dispatchNuUser] = useState<Bob | null>(null);

  const setNuUser = (bob: Bob) => {
    dispatchNuUser(bob);
  };

  return {
    nuUser,
    setNuUser,
  };
}
