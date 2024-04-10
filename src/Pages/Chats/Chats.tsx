/* eslint-disable import/no-unresolved */
/* eslint-disable simple-import-sort/imports */
import { Container, Form, InputGroup } from 'react-bootstrap';

import { useAppSelector } from 'Store/store/hooks';
import { MdOutlineArrowBackIos, MdSend } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ProfileIcon from 'Common/ProfileIcon';
import { currentUserInfo, unixTimeToReadableFormat } from 'Common/helperFns';
import { useState } from 'react';
import StyledMsgView from './ChatView.styles';
import Message from './Message';
import { chatSessionSocket } from './socket';

function ChatView({ openChat, setChatMessages }: MessageViewProps) {
  const userInfo = currentUserInfo();

  const { currentChatDetails, currentChatMessages } = useAppSelector(
    (state) => state.messages
  );

  const [message, setMessage] = useState('');

  const onSendMessage = () => {
    const sendMessageReq: SendMessageReq = {
      chatId: currentChatDetails.id,
      sentBy: userInfo.id,
      content: message,
    };
    chatSessionSocket.emit(
      'sendMessage',
      sendMessageReq,
      (messageRes: GetMessagesRes) => {
        setChatMessages(messageRes);
        setMessage('');
      }
    );
  };

  const onCloseChat = () => {
    chatSessionSocket.disconnect();
    openChat(false);
  };

  return (
    <StyledMsgView>
      <Container className="message-body-container py-3 p-0 message-view">
        <div className="chat-header pb-2">
          <div className="header-item">
            <MdOutlineArrowBackIos
              className="me-3 cursor-pointer"
              data-testid="go-back"
              color="#1c1950"
              size={25}
              title="Go Back"
              onClick={onCloseChat}
            />
          </div>
          <div className="header-item">
            <ProfileIcon
              profileDp={currentChatDetails.recepientDetails.photo || 'DEFAULT'}
              isOnline={
                currentChatDetails.recepientDetails.onlineStatus === 'Online'
              }
            />
          </div>
          <div className="user-name-status ms-2">
            <div className="user-name-flex">
              {currentChatDetails.recepientDetails.userName}
            </div>
            <div className="user-name-flex">
              {currentChatDetails.recepientDetails.onlineStatus === 'Online'
                ? 'Online'
                : `Last Seen at ${unixTimeToReadableFormat(
                    Math.round(
                      Date.parse(
                        currentChatDetails.recepientDetails.onlineStatus
                      ) / 1000
                    )
                  )}`}
            </div>
          </div>
          <div className="header-item">
            <BsThreeDotsVertical
              className="me-3 cursor-pointer"
              data-testid="message-options"
              color="#1c1950"
              size={25}
              title="Message Options"
            />
          </div>
        </div>
        <div className="message-body">
          {currentChatMessages.map(
            ({ content, sentAt, sentBy, id, isRead, isDelivered, type }) => (
              <Message
                key={id}
                content={content}
                sentAt={sentAt}
                messageType={
                  sentBy.userName === userInfo.userName
                    ? 'OUTGOING'
                    : 'INCOMING'
                }
                type={type}
                isRead={isRead}
                isDelivered={isDelivered}
              />
            )
          )}
        </div>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Type your message here. . . ."
            aria-label="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <InputGroup.Text className="cursor-pointer" onClick={onSendMessage}>
            <MdSend
              data-testid="message-send"
              color="#1c1950"
              size={25}
              title="Send Message"
            />
          </InputGroup.Text>
        </InputGroup>
      </Container>
    </StyledMsgView>
  );
}

export default ChatView;
