import { useState } from "react";

export function useStep5() {
  const [done, setDone] = useState(false);
  return { done };
}
