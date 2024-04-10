import { useCallback } from 'react';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { MdCheck } from 'react-icons/md';

import styled from 'styled-components';

import { unixTimeToReadableFormat } from 'Common/helperFns';

const StyledMessage = styled.div<Pick<MessageProps, 'messageType'>>`
  display: flex;
  justify-content: ${(props) =>
    props.messageType === 'INCOMING' ? 'flex-start' : 'flex-end'};
  align-items: flex-end;
  .message-box {
    max-width: 50%;
    min-width: 50%;
    background: ${(props) =>
      props.messageType === 'OUTGOING' ? '#ccccff' : 'white'};
    border: ${(props) =>
      props.messageType === 'INCOMING' ? '1px solid #b7b4b4' : 'none'};
    border-radius: ${(props) =>
      props.messageType === 'INCOMING'
        ? '0px 10px 10px 10px'
        : '10px 0px 10px 10px'};
    margin: 10px;
    padding: 10px;
  }
  .message-time-reciept {
    text-align: right;
    font-size: 12px;
    color: grey;
  }
`;

function Message(props: MessageProps) {
  const { messageType, content, sentAt, isRead, isDelivered } = props;
  const getReadReciepts = useCallback(() => {
    return isRead || isDelivered ? (
      <IoCheckmarkDoneOutline
        className="mx-2"
        size={15}
        color={isRead ? '#53bdeb' : 'black'}
      />
    ) : (
      <MdCheck className="mx-2" size={15} />
    );
  }, [isRead, isDelivered]);
  return (
    <StyledMessage messageType={messageType}>
      <div className="message-box">
        {content}
        <div className="message-time-reciept">
          {unixTimeToReadableFormat(Math.round(Date.parse(sentAt) / 1000))}
          {messageType === 'OUTGOING' && getReadReciepts()}
        </div>
      </div>
    </StyledMessage>
  );
}

export default Message;
