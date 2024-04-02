/* eslint-disable import/order */
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import NewAccount from './Pages/NewAccount';
import Timeline from './Pages/TimeLine';

import './App.css';

import { currentUserInfo } from 'Common/helperFns';
import AccountSettings from 'Pages/AccountSettings';
import MessageView from 'Pages/Chats/MessageView';
import { userSessionSocket } from 'Pages/Chats/socket';
import ForgotPassword from 'Pages/ForgotPassword';
import ResetPassword from 'Pages/ResetPassword';
import TimeLineHeader from 'Pages/TimeLine/Header';
import { setChatLoaderState, setChatsInfo } from 'Store/reducer/messageReducer';
import { useAppDispatch } from 'Store/store/hooks';

function App() {
  const dispatch = useAppDispatch();
  function onGetChatInfo(chatInfo: GetChatInfoRes[]) {
    dispatch(setChatLoaderState({ state: 'LOADED' }));
    dispatch(setChatsInfo({ data: chatInfo }));
  }

  const userInfo = currentUserInfo();

  useEffect(() => {
    const reqMsg: GetChatInfoReq = {
      userId: userInfo.id,
      onlineStatus: 'Online',
    };
    dispatch(setChatLoaderState({ state: 'LOADING' }));
    userSessionSocket.emit('getChatInfo', reqMsg, onGetChatInfo);
    userSessionSocket.on('getChatInfo', onGetChatInfo);
    return () => {
      userSessionSocket.off('getChatInfo', onGetChatInfo);
    };
  }, []);

  return (
    <>
      <TimeLineHeader />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/newaccount" element={<NewAccount />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/messages" element={<MessageView />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </>
  );
}

export default App;
