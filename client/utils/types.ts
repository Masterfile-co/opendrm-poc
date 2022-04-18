import { MessageKit } from "@nucypher/nucypher-ts";

export interface Metadata {
  title: string;
  description: string;
  msgKit: MessageKit;
}

export interface Step {
  label: string;
  title: string;
  done: boolean;
  active: boolean;
}


