import {
  JsonHubProtocol,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

export class SignalRClient {
  private connectionHub: string;

  private constructor(connectionHub: string) {
    this.connectionHub = connectionHub;
  }

  public static initialize(
    connectionHub: string,
    userId?: string | number
  ): HubConnection {
    let connectionString = connectionHub;
    if (userId) connectionString = `${connectionHub}/api?userId=${userId}`;
    return new SignalRClient(connectionString).initializeConnection();
  }

  private initializeConnection(): HubConnection {
    const connection = this.setupConnection();
    // WARNING: We Purposefully do not await this promise!
    this.startConnection(connection);
    return connection;
  }

  private setupConnection(): HubConnection {
    const connection = this.createConnection();
    this.onClose(connection);
    this.onReconnect(connection);
    this.onReconnecting(connection);
    return connection;
  }

  private createConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(this.connectionHub, {
        withCredentials: false,
      })
      .withAutomaticReconnect()
      .withHubProtocol(new JsonHubProtocol())
      .configureLogging(LogLevel.Information)
      .build();
  }

  private onClose(connection: HubConnection): void {
    connection.onclose((error) => {
      console.log(
        "Connection closed due to error. Try refreshing this page to restart the connection",
        error
      );
    });
  }

  private onReconnect(connection: HubConnection): void {
    connection.onreconnecting((error) => {
      console.log("Connection lost due to error. Reconnecting.", error);
    });
  }

  private onReconnecting(connection: HubConnection): void {
    connection.onreconnected((connectionId: string | undefined) => {
      console.info(
        "Connection reestablished. Connected with connectionId",
        connectionId
      );
    });
  }

  private async startConnection(
    connection: HubConnection,
    retries: number = 10
  ): Promise<void> {
    try {
      await connection.start();
      console.info("SignalR connection established");
    } catch (e) {
      console.error("SignalR Connection Error: ", e);
      if (retries <= 0) {
        console.error("SignalR Connection Error retries exhausted: ", e);
        return;
      }
      // Retry connection 10 times every 10 seconds, before throwing error.
      setTimeout(() => this.startConnection(connection, retries - 1), 10000);
    }
  }
}
