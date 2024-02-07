declare global {
  namespace SocketIO {
    interface Socket {
      sessionID?: string;
      userID?: string;
      username?: string;
    }
  }
}
