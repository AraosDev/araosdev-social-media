interface GetChatInfoReq {
  userId: string;
  onlineStatus: 'Online' | 'Offline' | 'Unknown';
}

interface GetChatInfoRes {
  id: string;
  recepientDetails: {
    photo: string;
    userName: string;
    onlineStatus: string;
  };
  recentMessage: {
    content: string;
    sentBy: string;
    sentAt: string;
  };
  unreadCount: number;
}

type ChatLoaderStates = 'LOADING' | 'LOADED' | 'ERROR';

interface MessagesState {
  chatLoaderState: ChatLoaderStates | null;
  chatInfo: GetChatInfoRes[];
}
