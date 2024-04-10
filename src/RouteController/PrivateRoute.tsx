import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { currentUserInfo } from 'Common/helperFns';
import { chatSessionSocket, userSessionSocket } from 'Pages/Chats/socket';
import TimeLineHeader from 'Pages/TimeLine/Header';
import { setChatLoaderState, setChatsInfo } from 'Store/reducer/messageReducer';
import { useAppDispatch } from 'Store/store/hooks';

function PrivateRoute() {
  const dispatch = useAppDispatch();
  function onGetChatInfo(chatInfo: GetChatInfoRes[]) {
    dispatch(setChatLoaderState({ state: 'LOADED_CHATS' }));
    dispatch(setChatsInfo({ data: chatInfo }));
  }

  const userInfo = currentUserInfo();

  useEffect(() => {
    if (userInfo.id) {
      const reqMsg: GetChatInfoReq = {
        userId: userInfo.id,
        onlineStatus: 'Online',
      };
      dispatch(setChatLoaderState({ state: 'LOADING_CHATS' }));
      userSessionSocket.connect();
      userSessionSocket.emit('getChatInfo', reqMsg, onGetChatInfo);
      userSessionSocket.on('getChatInfo', onGetChatInfo);
    }
    return () => {
      userSessionSocket.disconnect();
      if (!chatSessionSocket.disconnected) chatSessionSocket.disconnect();
    };
  }, []);
  if (userInfo.id) {
    return (
      <>
        <TimeLineHeader />
        <Outlet />
      </>
    );
  }
  return <Navigate to="/" />;
}

export default PrivateRoute;
