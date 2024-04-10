import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: MessagesState = {
  chatLoaderState: null,
  chatInfo: [],
  currentChatDetails: {
    id: '',
    recepientDetails: {
      photo: '',
      userName: '',
      onlineStatus: '',
    },
    unreadCount: 0,
  },
  currentChatMessages: [],
};

const messagesReducer = createSlice({
  name: 'messagesReducer',
  initialState,
  reducers: {
    setChatsInfo(state, action: PayloadAction<{ data: GetChatInfoRes[] }>) {
      const chatInfo = action.payload.data;
      state.chatInfo = action.payload.data;
      const updatedCurrentChatDetails =
        state.currentChatDetails.id &&
        chatInfo.find(({ id }) => id === state.currentChatDetails.id);
      if (updatedCurrentChatDetails)
        state.currentChatDetails = updatedCurrentChatDetails;
      return state;
    },
    setChatLoaderState(
      state,
      action: PayloadAction<{ state: ChatLoaderStates }>
    ) {
      state.chatLoaderState = action.payload.state;
      return state;
    },
    setCurrentChatDetails(state, action: PayloadAction<GetChatInfoRes>) {
      state.currentChatDetails = action.payload;
      return state;
    },
    setCurrentChatMessages(state, action: PayloadAction<ChatMessages[]>) {
      state.currentChatMessages = action.payload;
      return state;
    },
  },
});

export const {
  setChatsInfo,
  setChatLoaderState,
  setCurrentChatDetails,
  setCurrentChatMessages,
} = messagesReducer.actions;

export default messagesReducer.reducer;
