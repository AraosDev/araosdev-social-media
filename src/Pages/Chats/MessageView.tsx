/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

import styled from 'styled-components';

import { Loader } from 'Common/DataTransitionHandlers';
import { unixTimeToReadableFormat } from 'Common/helperFns';
import { useAppSelector } from 'Store/store/hooks';
import ProfileIcon from '../../Common/ProfileIcon';

const StyledMsgView = styled.div`
  max-height: calc(100vh - 85px);
  min-height: calc(100vh - 85px);
  overflow: auto;
  border-radius: 4px;
  .message-body-container {
    background-color: #ccccff;
    max-height: calc(100vh - 85px);
    min-height: calc(100vh - 85px);
    border-left: 1px solid #5d3fd3 !important;
    border-right: 1px solid #5d3fd3 !important;
    width: 750px;
  }
  .loader-element {
    max-height: calc(100vh - 101px);
    min-height: calc(100vh - 101px);
  }
  .message-profile-icon {
    flex: 1;
  }
  .message-frnd {
    flex: 16;
  }
  .message-recent-msg-time {
    flex: 4;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .message-user-name {
    font-weight: 650;
    font-size: 14px;
  }
  .message-recent {
    color: #888888;
    font-size: 13px;
  }
  .unread-count {
    background-color: red;
    border-radius: 50%;
    padding: 5px;
    width: 20px;
    font-size: 12px;
    text-align: center;
    margin-left: 5px;
    color: white;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 700;
  }
  .read-chat {
    background: #f5f5f5;
  }
`;

function MessageView(): React.ReactElement {
  const { chatLoaderState, chatInfo } = useAppSelector(
    (state) => state.messages
  );

  return (
    <StyledMsgView>
      <Container className="message-body-container py-3">
        {chatLoaderState === 'LOADING' ? (
          <Loader
            className="loader-element caveatBold"
            message="Loading your Chats . . ."
          />
        ) : (
          chatLoaderState === 'LOADED' &&
          chatInfo.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              className={`d-flex cursor-pointer ${
                !chat.unreadCount ? 'read-chat' : ''
              }`}
            >
              <ProfileIcon
                className="message-profile-icon"
                profileDp={chat.recepientDetails.photo}
                isOnline={chat.recepientDetails.onlineStatus === 'Online'}
              />
              <div className="d-flex flex-column mx-2 message-frnd">
                <span className="message-user-name">
                  {chat.recepientDetails.userName}
                </span>
                <span className="message-recent">
                  {chat.recentMessage.sentBy}: {chat.recentMessage.content}
                </span>
              </div>
              <div className="message-recent-msg-time">
                <span className="message-recent">
                  {unixTimeToReadableFormat(
                    Math.round(Date.parse(chat.recentMessage.sentAt) / 1000)
                  )}
                </span>
                {chat.unreadCount ? (
                  <span className="unread-count">{chat.unreadCount}</span>
                ) : null}
              </div>
            </ListGroup.Item>
          ))
        )}
      </Container>
    </StyledMsgView>
  );
}

export default MessageView;
