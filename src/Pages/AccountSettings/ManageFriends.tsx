/* eslint-disable import/order */
import { useState } from 'react';
import { Badge, Container, ListGroup, Tab, Tabs } from 'react-bootstrap';

import { StyledManageFriends } from './index.styles';

import { Loader } from 'Common/DataTransitionHandlers';
import { currentUserInfo } from 'Common/helperFns';
import ProfileIcon from 'Common/ProfileIcon';
import { frndUserRelation } from 'Pages/TimeLine/HelperFns';
import { useFriendRequestMutation } from 'Store/apiSlices/mainAPISlice';
import { friendRequestTrigger } from 'Store/mutationTriggers/frndReqTrigger';

function RenderFriendist(props: RenderFriendListProps) {
  const { viewType } = props;
  const { friends, friendRequests } = currentUserInfo();
  const { requestedBy, requestedTo } = friendRequests;
  const frndList =
    viewType === 'FRIENDS'
      ? friends
      : viewType === 'FRIENDREQUESTS'
      ? requestedBy
      : requestedTo;

  const [friendReqtTrigger] = useFriendRequestMutation();

  const [frndReqState, setFrndReqState] = useState<
    { frnd: string; state: string }[]
  >([]);

  const frndUserRelationChange = (
    frnd: UserInfo,
    label: string,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    const { reqType } = frndUserRelation(frnd.userName);
    const reqBody = {
      friendDetails: frnd,
      userDetails: currentUserInfo(),
      requestType:
        viewType === 'FRIENDS' && label === 'Remove Friend'
          ? 'REMOVE_FRIEND'
          : reqType || (label.includes('Accept') ? 'ACCEPT_REQ' : 'REJECT_REQ'),
    };
    friendRequestTrigger(friendReqtTrigger, { ...reqBody, event }, (state) => {
      const { requestType } = reqBody;
      const existingStates = [...frndReqState];
      const currentFrndReqState = existingStates.find(
        ({ frnd: friend }) => friend === frnd.userName
      );
      const currentFrndReqStateIndex = existingStates.findIndex(
        ({ frnd: friend }) => friend === frnd.userName
      );
      if (currentFrndReqState) {
        const newState = {
          ...currentFrndReqState,
          state: `${requestType}_${state}`,
        };
        existingStates.splice(currentFrndReqStateIndex, 1, newState);
      } else
        existingStates.push({
          frnd: frnd.userName,
          state: `${requestType}_${state}`,
        });
      setFrndReqState(existingStates);
    });
  };

  const getActionButtons = (friend: UserInfo) => {
    const { state } = frndReqState.find(
      ({ frnd }) => frnd === friend.userName
    ) || { state: '' };

    const { loaderLabel, label } = frndUserRelation(friend.userName);

    if (state.includes('LOADING') && loaderLabel)
      return (
        <Badge className="cursor-not-allowed" text="dark">
          <Loader message={loaderLabel} inlineText />
        </Badge>
      );
    if (state.includes('LOADING') && !loaderLabel) {
      const splLoaderLabel = state.includes('ACCEPT_REQ')
        ? 'Accepting Request'
        : 'Rejecting Request';
      return (
        <Badge className="cursor-not-allowed" text="dark">
          <Loader message={splLoaderLabel} inlineText />
        </Badge>
      );
    }

    if (!label && viewType !== 'FRIENDS') {
      return ['Accept Request', 'Reject Request'].map((lab) => (
        <Badge
          key={lab}
          onMouseDown={(e) => frndUserRelationChange(friend, lab, e)}
          className="cursor-pointer mx-2"
          text="dark"
        >
          {lab}
        </Badge>
      ));
    }

    return (
      <Badge
        className="cursor-pointer"
        onMouseDown={(e) =>
          frndUserRelationChange(
            friend,
            viewType === 'FRIENDS' ? 'Remove Friend' : label,
            e
          )
        }
        text="dark"
      >
        {viewType === 'FRIENDS' ? 'Remove Friend' : label}
      </Badge>
    );
  };

  return (
    <ListGroup>
      {frndList.map(({ userName, id, photo, ...rest }) => (
        <ListGroup.Item
          key={id}
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex align-items-center">
            <ProfileIcon profileDp={photo || 'DEFAULT'} className="mx-2" />
            {userName}
          </div>
          <div>{getActionButtons({ userName, id, photo, ...rest })}</div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function ManageFriends() {
  const tabConfig = [
    {
      eventKey: 'FRIENDS',
      title: 'Friends',
    },
    {
      eventKey: 'FRIENDREQUESTS',
      title: 'Friend Requests',
    },
    {
      eventKey: 'FRIENDREQUESTSENT',
      title: 'Friend Request Sent',
    },
  ];
  return (
    <StyledManageFriends fluid>
      <Tabs
        defaultActiveKey="FRIENDS"
        id="uncontrolled-tab-example"
        className="mb-3 w-100 d-flex justify-content-between align-items-center caveatBold"
      >
        {tabConfig.map(({ eventKey, title }) => (
          <Tab key={eventKey} eventKey={eventKey} title={title}>
            <Container className="px-5 d-flex justify-content-center w-100 h-100 overflow-auto">
              <RenderFriendist
                viewType={eventKey as RenderFriendListProps['viewType']}
              />
            </Container>
          </Tab>
        ))}
      </Tabs>
    </StyledManageFriends>
  );
}

export default ManageFriends;
