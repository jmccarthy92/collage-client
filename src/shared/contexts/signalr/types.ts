import { HubConnection } from "@microsoft/signalr";

export interface Connection {
  connection: HubConnection | null;
}

export interface Props {
  children: JSX.Element | Array<JSX.Element>;
  userId?: number | string;
}
