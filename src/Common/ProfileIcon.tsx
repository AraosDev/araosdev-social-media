/* eslint-disable import/order */
/* eslint-disable react/jsx-props-no-spreading */
import styled from 'styled-components';

import { currentUserInfo } from './helperFns';

import DefaultDp from 'Assets/default.jpg';

const StyledProfileIcon = styled.div`
  width: ${(props) => props.iconSize};
  height: ${(props) => props.iconSize};
  border-radius: 50%;
  color: ${(props: ProfileIconProps) => props.iconTextColor};
  img {
    width: ${(props) => props.iconSize};
    height: ${(props) => props.iconSize};
    border-radius: 50%;
  }
  .green-dot {
    width: 5px;
    border-radius: 50%;
    border: 5px solid green;
    position: relative;
    top: 35%;
    right: 25%;
  }
`;

function ProfileIcon({
  className = '',
  iconSize = '40px',
  iconTextColor = 'white',
  profileDp = '',
  isOnline = false,
  ...otherProps
}: ProfileIconProps) {
  const imageSrc = profileDp || currentUserInfo().photo || DefaultDp;
  return (
    <StyledProfileIcon
      iconSize={iconSize}
      iconTextColor={iconTextColor}
      className={`cursor-pointer d-flex justify-content-center align-items-center ${className}`}
      {...otherProps}
    >
      <img src={imageSrc} className="dp-image" alt="user-dp" />
      {isOnline && <div className="green-dot" />}
    </StyledProfileIcon>
  );
}

export default ProfileIcon;
