import styled from 'styled-components';

const StyledMsgView = styled.div`
  max-height: calc(100vh - 85px);
  min-height: calc(100vh - 85px);
  overflow: auto;
  border-radius: 4px;
  .add-chat-list {
    border: none !important;
  }
  .bg-primary {
    background-color: #5d3fd3 !important;
    border: 1px solid #5d3fd3 !important;
    color: white !important;
  }
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
  .message-view {
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: white !important;
  }
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 2px 3px grey;
    z-index: 5;
  }
  .header-item {
    flex: 1;
  }
  .user-name-status {
    flex: 14;
    display: flex;
    flex-direction: column;
  }
  .user-name-flex {
    flex: 1;
    justify-content: center;
    align-items: flex-start;
    font-weight: 600;
  }
  .message-body {
    flex: 14;
    background: #f8f8ff;
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
  }
  .input-group {
    padding: 10px 0px 10px 15px;
    background: #ccccff;
  }
  .form-control {
    border: none !important;
    border-radius: 5px !important;
  }
  .form-control:focus {
    box-shadow: none !important;
  }
  .input-group-text {
    border: none !important;
    background: none !important;
    border-radius: 0px !important;
  }
`;

export default StyledMsgView;
