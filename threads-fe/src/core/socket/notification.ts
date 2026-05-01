import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection;

export const startConnection = async (userId: string) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5064/hubs/notifications", {
      accessTokenFactory: () => localStorage.getItem("token") || ""
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();

  console.log("✅ Connected");

  await connection.invoke("JoinUserGroup", userId);

  return connection;
};

export const onReceiveNotification = (cb: any) => {
  connection.on("ReceiveNotification", cb);
};