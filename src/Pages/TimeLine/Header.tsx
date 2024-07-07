/* eslint-disable import/order */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useCallback, useRef, useState } from 'react';
import { Badge, Form } from 'react-bootstrap';
import { AiOutlineHome } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { BsChatDots, BsPlusSquare, BsXLg } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import AutoSuggestion from '../../Common/AutoSuggestion/AutoSuggestion';
import { Loader } from '../../Common/DataTransitionHandlers';
import FormHeader from '../../Common/FormHeader';
import {
  currentUser,
  currentUserInfo,
  unixTimeToReadableFormat,
} from '../../Common/helperFns';
import ModalComp from '../../Common/ModalComp';
import ProfileIcon from '../../Common/ProfileIcon';
import TimelinePostCard from '../../Common/TimelinePostCard';

import { frndUserRelation } from './HelperFns';

import {
  useFriendRequestMutation,
  useLazyLogoutUserQuery,
  usePostTimelineImgMutation,
  useSearchFriendListQuery,
} from 'Store/apiSlices/mainAPISlice';
import { friendRequestTrigger } from 'Store/mutationTriggers/frndReqTrigger';
import { postImageInTimeline } from 'Store/mutationTriggers/timelineTrigger';
import { setTimelineState } from 'Store/reducer/timelineReducer';
import { useAppDispatch, useAppSelector } from 'Store/store/hooks';

const StyledTimeLineHeader = styled.div`
  display: flex;
  max-height: 85px;
  min-height: 60px;
  background: rgb(204, 204, 255);
  top: 0;
  width: 100%;
  border-bottom: 1px solid rgb(93, 63, 211);
  .display-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #1c1950;
    color: white;
  }
  .bg-primary {
    background-color: rgb(204, 204, 255) !important;
    border: 1px solid rgb(93, 63, 211) !important;
  }
  .msg-unread-count {
    position: absolute;
    top: 3%;
    color: white;
    background: red;
    border-radius: 50%;
    padding: 2px;
    font-size: 10px;
    font-weight: 700;
    width: 15px;
    text-align: center;
  }
`;

function TimeLineHeader(): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userName = currentUser();

  const postedImgRef = useRef<null | HTMLInputElement>(null);

  const { timelineState } = useAppSelector((state) => state.timelineReducer);
  const { chatInfo } = useAppSelector((state) => state.messages);

  const [selectedFrnd, setSelectedFrnd] = useState('');
  const [frndReqState, setFrndReqState] = useState<
    { frnd: string; state: string }[]
  >([]);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [postedImg, setPostedImg] = useState<null | File>(null);
  const [postedImgCaption, setPostedImgCaption] = useState('');
  const [postImgState, setPostImgState] = useState('');
  const [debouncedSearchKey, setDebouncedSearchKey] = useState('');

  const [postImage, { isLoading }] = usePostTimelineImgMutation();
  const [logout] = useLazyLogoutUserQuery();
  const {
    data: frndSuggestions,
    isFetching: isFrndSuggestionLoading,
    isError: isFrndSuggestionErr,
    isSuccess: isFrndSuggestionFetched,
    error: frndSuggestionErr,
  } = useSearchFriendListQuery(debouncedSearchKey);
  const [friendReqtTrigger] = useFriendRequestMutation();
  const userInfo = currentUserInfo();

  const unreadCount = useCallback(() => {
    return chatInfo.reduce(
      (prevCount, chat) => prevCount + chat.unreadCount,
      0
    );
  }, [chatInfo]);

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
      userDetails: userInfo,
      requestType:
        reqType || (label.includes('Accept') ? 'ACCEPT_REQ' : 'REJECT_REQ'),
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

  const getFrndRelationBadgeLabel = (frnd: UserInfo) => {
    const { state = '' } =
      frndReqState.find(({ frnd: friend }) => friend === frnd.userName) || {};
    const { label, loaderLabel } = frndUserRelation(frnd.userName);
    if (state.includes('LOADING') && loaderLabel) {
      return (
        <Badge className="cursor-not-allowed" text="dark">
          <Loader inlineText message={loaderLabel} />
        </Badge>
      );
    }
    if (state.includes('LOADING') && !loaderLabel) {
      const splLoaderLabel = state.includes('ACCEPT_REQ')
        ? 'Accepting Request'
        : 'Rejecting Request';
      return (
        <Badge className="cursor-not-allowed" text="dark">
          <Loader inlineText message={splLoaderLabel} />
        </Badge>
      );
    }
    if (!label) {
      return (
        <div>
          {['Reject Request', 'Accept Request'].map((lab) => (
            <Badge
              key={lab}
              onMouseDown={(e) => frndUserRelationChange(frnd, lab, e)}
              className="cursor-pointer mx-2"
              text="dark"
            >
              {lab}
            </Badge>
          ))}
        </div>
      );
    }
    return (
      <Badge
        onMouseDown={(e) => frndUserRelationChange(frnd, '', e)}
        className="cursor-pointer"
        text="dark"
      >
        {label}
      </Badge>
    );
  };

  const onCaptureUploadedImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setPostedImg(e.target.files[0]);
    }
  };

  const closeModal = () => {
    setPostedImg(null);
    setPostedImgCaption('');
    postedImgRef.current = null;
    setPostImgState('');
    setOpenAddPostModal(false);
  };

  const postTimelineImage = () => {
    if (postedImg) {
      const { name = '' } = postedImg;
      const supportedImgFormats = ['jpg', 'jpeg', 'png'];
      if (
        supportedImgFormats.includes(name.split('.').pop()?.toLowerCase() || '')
      ) {
        postImageInTimeline(
          postImage,
          {
            file: postedImg,
            caption: postedImgCaption,
          },
          (state) => {
            if (state === 'SUCCESS') closeModal();
            else setPostImgState(state);
          }
        );
      }
    }
  };

  const switchViews = (view: TimelineStates) => {
    dispatch(setTimelineState(view));
  };

  const switchToMessageView = () => {
    switchViews('MESSAGE_VIEW');
    navigate('/messages');
  };

  return (
    <StyledTimeLineHeader>
      <ModalComp
        openModalState={openAddPostModal}
        onCloseModal={() => closeModal()}
        modalSize="lg"
        header="Add your post"
        bodyClass="d-flex flex-column"
        proceedValidation={
          Boolean(postedImg) && Boolean(postedImgCaption) && !postImgState
        }
        titleTag="h3"
        proceedHandler={postTimelineImage}
        validationMsg={
          !postedImg
            ? 'Please upload an image to post'
            : !postedImgCaption
            ? 'Please type in image caption'
            : ''
        }
        modalBody={() =>
          postImgState === 'ERROR' ? (
            <div style={{ height: 400 }}>
              Something went wrong. Please try again after Some time.
            </div>
          ) : isLoading ? (
            <div style={{ height: 400 }}>
              <Loader message="Posting your image" />
            </div>
          ) : (
            <>
              <Form.Group style={{ flex: 1 }} className="mb-3">
                <Form.Label>Allowed Image Format: jpg, jpeg, png</Form.Label>
                <div className="d-flex mb-3 align-items-center">
                  <Form.Control
                    ref={postedImgRef}
                    data-testid="post-image-input"
                    type="file"
                    className="me-2"
                    onChange={onCaptureUploadedImg}
                  />
                  <BsXLg
                    onClick={() => {
                      setPostedImg(null);
                      postedImgRef.current = null;
                    }}
                    data-testid="post-image-clear"
                    className="cursor-pointer"
                  />
                </div>
                <Form.Control
                  value={postedImgCaption}
                  onChange={(e) => setPostedImgCaption(e.target.value)}
                  placeholder="Type your caption here"
                />
              </Form.Group>
              <TimelinePostCard
                cardClassName="mb-4"
                cardStyle={{ flex: 1 }}
                imagePostedBy={userName}
                imagePostedOn={unixTimeToReadableFormat(
                  Math.round(new Date().getTime() / 1000)
                )}
                imgcaption={postedImgCaption}
                imgSrc={postedImg ? URL.createObjectURL(postedImg) : ''}
                commentType="none"
                didCurrentUserLiked={false}
                updateLikeCount={() => {}}
                imgLikes={0}
                commentSection={[]}
                noImgAvailableText="Add your image to see the preview"
              />
            </>
          )
        }
        proceedLabel="Post"
      />
      <div className="mx-3 my-2" style={{ flex: '3' }}>
        <FormHeader hr={false} inline />
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ flex: '9' }}
      >
        <AutoSuggestion
          defaultValue={selectedFrnd}
          inputTypeProps={{
            inputTextFontSize: 16,
            placeholder: 'Search your Friends',
            dropDownStyle: {
              fontSize: 16,
              fontWeight: 'normal',
              position: 'absolute',
              marginTop: '38px',
            },
            label: '',
            caption: '',
          }}
          totalList={
            isFrndSuggestionLoading
              ? 'LOADING'
              : isFrndSuggestionErr
              ? (frndSuggestionErr as unknown as 'EMPTY' | 'ERROR')
              : isFrndSuggestionFetched && Array.isArray(frndSuggestions)
              ? frndSuggestions
              : []
          }
          onSuggestionClick={({ value }) => setSelectedFrnd(value)}
          minLengthToShowSuggestion={1}
          onSearchKeyChange={setDebouncedSearchKey}
          customListComponent={(valObj, onHoverList, className) => {
            const { value, valueId } = valObj;
            return (
              <li
                className={`${className} d-flex justify-content-between p-2`}
                key={valueId}
                onMouseDown={() => onHoverList(valObj)}
              >
                {value}
                {getFrndRelationBadgeLabel(valObj as unknown as UserInfo)}
              </li>
            );
          }}
        />
      </div>
      <div
        className="d-flex justify-content-end align-items-center"
        style={{ flex: '3' }}
      >
        {timelineState === 'MESSAGE_VIEW' ||
        timelineState === 'ACCOUNT_VIEW' ? (
          <AiOutlineHome
            className="me-3 cursor-pointer"
            data-testid="add-post"
            color="#1c1950"
            size={25}
            title="Timeline"
            onClick={() => {
              switchViews('TIMELINE_VIEW');
              navigate('/timeline');
            }}
          />
        ) : null}
        {timelineState === 'ACCOUNT_VIEW' ||
        timelineState === 'TIMELINE_VIEW' ? (
          <div>
            <BsChatDots
              className="me-3 cursor-pointer"
              data-testid="add-post"
              color="#1c1950"
              size={25}
              title="Chats"
              onClick={switchToMessageView}
            />
            <div className="msg-unread-count">{unreadCount()}</div>
          </div>
        ) : null}
        <BsPlusSquare
          className="me-3 cursor-pointer"
          data-testid="add-post"
          color="#1c1950"
          size={25}
          title="Add Post"
          onClick={() => setOpenAddPostModal(true)}
        />
        <ProfileIcon
          iconText={userName.charAt(0).toUpperCase()}
          className="me-5 cursor-pointer"
          onClick={() => {
            switchViews('ACCOUNT_VIEW');
            navigate('/account-settings');
          }}
        />
        <BiLogOut
          className="me-3 cursor-pointer"
          data-testid="add-post"
          color="#1c1950"
          size={25}
          title="Logout"
          onClick={() => {
            logout(null).then((res) => {
              if (res.data?.status === 'SUCCESS') {
                localStorage.clear();
                switchViews('TIMELINE_VIEW');
                navigate('/', { replace: true });
              }
            });
          }}
        />
      </div>
    </StyledTimeLineHeader>
  );
}

export default TimeLineHeader;
