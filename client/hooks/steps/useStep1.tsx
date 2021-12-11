import { useConnect } from "hooks/connect/useConnect";
import { useEffect, useState } from "react";

export function useStep1() {
  const [done, setDone] = useState(false);
  const { requestConnection, error, active, library } = useConnect();

  useEffect(() => {
    if (!error && active) {
      setDone(true);
    }
  }, [error, active]);

  return {
    done,
    requestConnection,
    error,
    active,
	library
  };
}
