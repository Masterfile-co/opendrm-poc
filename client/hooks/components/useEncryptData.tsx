import { MessageKit } from "nucypher-ts";
import { useState } from "react";

export function useEncryptData() {
  const [cleartext, setCleartext] = useState("");
  const [label, setLabel] = useState("");
  const [messageKit, setMessageKit] = useState<MessageKit | null>(null);

  return {
    label,
    setLabel,
    cleartext,
    setCleartext,
    messageKit,
    setMessageKit,
  };
}
