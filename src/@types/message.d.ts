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
  recentMessage?: {
    content: string;
    sentBy: string;
    sentAt: string;
  };
  unreadCount: number;
}

interface CreateChatReq {
  owner: string;
  member: string;
}

interface ChatMessages {
  id: string;
  sentBy: GetChatInfoRes['recepientDetails'];
  sentAt: string;
  type: string;
  content: string;
  chatId: string;
  isRead?: boolean;
  isDelivered?: boolean;
}

interface GetMessagesReq {
  chatId: string;
  userId: string;
}

interface SendMessageReq {
  chatId: string;
  sentBy: string;
  content: string;
}

interface GetMessagesRes {
  chatId: GetMessagesReq['chatId'];
  messages: ChatMessages[];
}

type ChatLoaderStates =
  | 'LOADING_CHATS'
  | 'LOADED_CHATS'
  | 'ERROR_CHATS'
  | 'LOADING_MESSAGES'
  | 'LOADED_MESSAGES'
  | 'ERROR_MESSAGES'
  | null;

interface MessagesState {
  chatLoaderState: ChatLoaderStates;
  chatInfo: GetChatInfoRes[];
  currentChatDetails: GetChatInfoRes;
  currentChatMessages: ChatMessages[];
}

interface MessageViewProps {
  openChat: React.Dispatch<React.SetStateAction<boolean>>;
  setChatMessages: (messagesRes: GetMessagesRes) => void;
}

interface MessageProps extends Omit<ChatMessages, 'id' | 'sentBy' | 'chatId'> {
  messageType: 'INCOMING' | 'OUTGOING';
}
