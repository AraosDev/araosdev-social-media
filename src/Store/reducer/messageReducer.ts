import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: MessagesState = {
  chatLoaderState: null,
  chatInfo: [],
};

const messagesReducer = createSlice({
  name: 'messagesReducer',
  initialState,
  reducers: {
    setChatsInfo(state, action: PayloadAction<{ data: GetChatInfoRes[] }>) {
      state.chatInfo = action.payload.data;
      return state;
    },
    setChatLoaderState(
      state,
      action: PayloadAction<{ state: ChatLoaderStates }>
    ) {
      state.chatLoaderState = action.payload.state;
      return state;
    },
  },
});

export const { setChatsInfo, setChatLoaderState } = messagesReducer.actions;

export default messagesReducer.reducer;
