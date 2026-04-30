import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection;

export const startConnection = async (userId: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5064/hubs/notifications", {
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();
  await connection.invoke("JoinUserGroup", userId);

  console.log("✅ connected");
};

export const onReceiveNotification = (cb: any) => {
  connection.on("ReceiveNotification", cb);
};