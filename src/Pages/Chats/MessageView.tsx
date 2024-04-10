/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable simple-import-sort/imports */
import React, { useEffect, useState } from 'react';
import { Badge, Container, Form, ListGroup } from 'react-bootstrap';

import { Loader } from 'Common/DataTransitionHandlers';
import { currentUserInfo, unixTimeToReadableFormat } from 'Common/helperFns';
import { useAppDispatch, useAppSelector } from 'Store/store/hooks';
import {
  setChatLoaderState,
  setChatsInfo,
  setCurrentChatDetails,
  setCurrentChatMessages,
} from 'Store/reducer/messageReducer';
import ModalComp from 'Common/ModalComp';
import ProfileIcon from '../../Common/ProfileIcon';
import ChatView from './Chats';
import StyledMsgView from './ChatView.styles';
import { chatSessionSocket, userSessionSocket } from './socket';

function MessageView(): React.ReactElement {
  const userInfo = currentUserInfo();
  const dispatch = useAppDispatch();
  const { chatLoaderState, chatInfo } = useAppSelector(
    (state) => state.messages
  );
  const [isChatSelected, setChatSelected] = useState(false);
  const [isOpenAddChatDialog, setOpenAddChatDialog] = useState(false);
  const [filterChatList, setFilterChatList] = useState('');

  useEffect(() => {
    if (chatLoaderState?.includes('MESSAGES'))
      dispatch(
        setChatLoaderState({
          state: chatInfo.length ? 'LOADED_CHATS' : 'LOADING_CHATS',
        })
      );
  }, []);

  const setChatMessages = (messagesRes: GetMessagesRes) => {
    dispatch(setCurrentChatMessages(messagesRes.messages));
    if (chatLoaderState !== 'LOADED_MESSAGES')
      dispatch(setChatLoaderState({ state: 'LOADED_MESSAGES' }));
    if (!isChatSelected) setChatSelected(true);
  };

  function onOpenChat(chatDetails: GetChatInfoRes) {
    dispatch(setCurrentChatDetails(chatDetails));
    dispatch(setChatLoaderState({ state: 'LOADING_MESSAGES' }));
    const getMessagesReq: GetMessagesReq = {
      chatId: chatDetails.id,
      userId: userInfo.id,
    };
    chatSessionSocket.connect();
    chatSessionSocket.emit(
      'getMessagesOfChat',
      getMessagesReq,
      setChatMessages
    );
    chatSessionSocket.on('getMessagesOfChat', setChatMessages);
  }

  const closeAddChatDialog = () => {
    setOpenAddChatDialog(false);
    if (filterChatList) setFilterChatList('');
  };

  const createChat = (member: string, memberName: string) => {
    const request: CreateChatReq = {
      owner: userInfo.id,
      member,
    };
    userSessionSocket.emit(
      'createChat',
      request,
      (updatedChatList: GetChatInfoRes[]) => {
        dispatch(setChatsInfo({ data: updatedChatList }));
        const createdChat = updatedChatList.find(
          ({ recepientDetails }) => recepientDetails.userName === memberName
        );
        if (createdChat) onOpenChat(createdChat);
        closeAddChatDialog();
      }
    );
  };

  const renderCreateChatDialog = () => {
    const existingChatUserObj: Record<string, boolean> = {};
    chatInfo.forEach(({ recepientDetails }) => {
      existingChatUserObj[recepientDetails.userName] = true;
    });
    const userFriends = userInfo.friends.filter(
      ({ userName }) => !existingChatUserObj[userName]
    );
    if (userFriends.length) {
      return (
        <div className="d-flex flex-column w-100">
          <Form.Control
            placeholder="Start typing to filter your friends"
            onChange={(e) => setFilterChatList(e.target.value)}
            value={filterChatList}
          />
          <ListGroup className="my-3">
            {userFriends.map(({ userName, id, photo }) =>
              userName.toLowerCase().includes(filterChatList.toLowerCase()) ? (
                <ListGroup.Item
                  className="add-chat-list cursor-pointer d-flex w-100 align-items-center"
                  key={id}
                  onClick={() => createChat(id, userName)}
                >
                  <ProfileIcon
                    className="message-profile-icon me-2"
                    profileDp={photo || 'DEFAULT'}
                  />
                  {userName}
                </ListGroup.Item>
              ) : null
            )}
          </ListGroup>
        </div>
      );
    }
    return <p>All of your friends is already in your chat list</p>;
  };

  if (isChatSelected)
    return (
      <ChatView openChat={setChatSelected} setChatMessages={setChatMessages} />
    );

  return (
    <StyledMsgView>
      <Container className="message-body-container py-3">
        <ModalComp
          openModalState={isOpenAddChatDialog}
          onCloseModal={closeAddChatDialog}
          modalSize="sm"
          header="Select your friends to chat"
          shouldShowProceedBtn={false}
          modalBody={renderCreateChatDialog}
          titleTag="h6"
        />
        {chatLoaderState?.includes('LOADING') ? (
          <Loader
            className="loader-element caveatBold"
            message={`Loading your ${
              chatLoaderState === 'LOADING_CHATS' ? 'chats' : 'messages'
            } . . .`}
          />
        ) : (
          chatLoaderState?.includes('LOADED') && (
            <div className="d-flex justify-content-start align-items-start flex-column">
              <div className="d-flex justify-content-end mb-2 w-100">
                <Badge
                  className="ms-2 cursor-pointer"
                  text="dark"
                  onClick={() => setOpenAddChatDialog(true)}
                >
                  New Chat
                </Badge>
              </div>
              <ListGroup className="w-100">
                {chatInfo.map((chat) => (
                  <ListGroup.Item
                    key={chat.id}
                    className={`d-flex cursor-pointer ${
                      !chat.unreadCount ? 'read-chat' : ''
                    }`}
                    onClick={() => onOpenChat(chat)}
                  >
                    <ProfileIcon
                      className="message-profile-icon"
                      profileDp={chat.recepientDetails.photo || 'DEFAULT'}
                      isOnline={chat.recepientDetails.onlineStatus === 'Online'}
                    />
                    <div className="d-flex flex-column mx-2 message-frnd">
                      <span className="message-user-name">
                        {chat.recepientDetails.userName}
                      </span>
                      <span className="message-recent">
                        {chat.recentMessage?.sentBy
                          ? `${chat.recentMessage?.sentBy}: `
                          : ''}{' '}
                        {chat.recentMessage?.content || ''}
                      </span>
                    </div>
                    <div className="message-recent-msg-time">
                      <span className="message-recent">
                        {chat.recentMessage?.sentAt
                          ? unixTimeToReadableFormat(
                              Math.round(
                                Date.parse(chat.recentMessage.sentAt) / 1000
                              )
                            )
                          : ''}
                      </span>
                      {chat.unreadCount ? (
                        <span className="unread-count">{chat.unreadCount}</span>
                      ) : null}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )
        )}
      </Container>
    </StyledMsgView>
  );
}

export default MessageView;
