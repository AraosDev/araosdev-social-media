import React, { useState } from 'react'
import { Badge, Container, ListGroup, Tab, Tabs } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Loader } from '../../Common/DataTransitionHandlers'
import { didCurrentUserLiked } from './HelperFns'
import TimelinePostCard from '../../Common/TimelinePostCard'
import ProfileIcon from '../../Common/ProfileIcon'
import { currentUser, currentUserInfo } from '../../Common/helperFns'
import { friendRequestAction } from '../../Store/actions/frndRequestsActions'
import MessageView from './Components/MessageView'
import { useGetTimeLineImgsQuery, useUpdateCommentMutation, useUpdateLikeCountMutation } from 'api/apiSlice'

const StyledTimelineBody = styled.div`
  max-height: calc(100vh - 85px);
  min-height: calc(100vh - 85px);
  overflow: auto;
  .frnd-list-view{
    min-height: calc(100vh - 85px);
  }
  .timeline-body-container {
    background-color: rgb(204, 204, 255);
    border-left: 1px solid rgb(93, 63, 211) !important;
    border-right: 1px solid rgb(93, 63, 211) !important;
    width: 750px;
    .loader-element {
      height: calc(100vh - 85px);
    }
    .tab-content{
      background: white;
      min-height: calc(100vh - 159px);
    }
    .list-grp-custom-cls {
      border: 1px solid rgba(0, 0, 0, 0.125);
      border-radius: 5px;
      background-color: white;
    }
    .form-control {
      border-bottom: 1px solid #ced4da !important;
      border: 0px;
      border-radius: 0px !important;
    }
    .form-control:focus {
      box-shadow: 0 1px rgb(204 204 255);
      border-bottom: 1px solid rgb(204, 204, 255) !important;
    }
    .profile-comment {
      flex: 1;
    }
    .bg-primary {
      background-color: rgb(204, 204, 255) !important;
      border: 1px solid rgb(93, 63, 211) !important;
    }
  }
`

function TimelineBody () {
  const dispatch = useDispatch()
  const { isFetching, isSuccess, data } = useGetTimeLineImgsQuery(currentUser())
  const [updateLikeCountFn] = useUpdateLikeCountMutation()
  const [updateCommentFn] = useUpdateCommentMutation()
  const { timelineState } = useSelector(
    (state) => state.timelineReducer
  )

  const { friends, friendRequests = {} } = currentUserInfo()
  const { requestedTo, requestedBy } = friendRequests

  const [openedCommentSectImgs, setOpenCommentSecImgs] = useState([])
  const [newCommentInImgs, setNewCommentInImgs] = useState([])
  const [frndReqState, setFrndReqState] = useState([])
  const [frndReqTab, setFrndReqTab] = useState('My Friends')

  const updateLikeCount = (imgDetail, flag) => {
    const reqBody = {
      postName: imgDetail.image,
      postedBy: imgDetail.userName,
      likedFlag: flag,
      imgDetail
    }
    updateLikeCountFn(reqBody).unwrap()
  }

  const openCommentSection = (imgDetail) => {
    const { _id } = imgDetail
    if (openedCommentSectImgs.includes(_id)) {
      setOpenCommentSecImgs([
        ...openedCommentSectImgs.filter((id) => id !== _id)
      ])
    } else setOpenCommentSecImgs([...openedCommentSectImgs, _id])
  }

  const updateComment = (imgDetail) => {
    const comment = newCommentInImgs.find(
      ({ id }) => imgDetail._id === id
    ).comment
    if (comment) {
      const reqBody = {
        postName: imgDetail.image,
        postedBy: imgDetail.userName,
        comment,
        imgDetail,
        onCacheUpdate: () => {
          setNewCommentInImgs(
            newCommentInImgs.filter(({ id }) => imgDetail._id !== id)
          )
        }
      }
      updateCommentFn(reqBody).unwrap()
    }
  }

  const getCurrentCommentValue = (imgDetail) => {
    const { comment = '' } =
      newCommentInImgs.find(({ id }) => imgDetail._id === id) || {}
    if (comment) return comment
    else return ''
  }

  const handleUserFrndRelations = (friend, requestType) => {
    let reqBody = { friend, requestType }
    if (requestType === 'ACCEPT_REQ' || requestType === 'REJECT_REQ') {
      reqBody = {
        friend: currentUser(),
        user: friend,
        requestType
      }
    }
    dispatch(friendRequestAction(reqBody, (state) => {
      const existingStates = [...frndReqState]
      const currentFrndReqState = existingStates.find(({ frnd }) => friend === frnd)
      const currentFrndReqStateIndex = existingStates.findIndex(({ frnd }) => friend === frnd)
      if (currentFrndReqState) {
        const newState = {
          ...currentFrndReqState,
          state: `${requestType}_${state}`
        }
        existingStates.splice(currentFrndReqStateIndex, 1, newState)
      } else existingStates.push({ friend, state: `${requestType}_${state}` })
      setFrndReqState(existingStates)
    }))
  }

  const getTimelineContent = () => {
    if (isFetching) {
      return (
        <Loader
            className="loader-element caveatBold"
            message="Loading your feeds . . ."
          />
      )
    } else if (isSuccess && timelineState !== 'FRIEND_LIST_VIEW' && timelineState !== 'MESSAGE_VIEW') {
      return (
        <div className="py-3">
          {data.map((image, index) =>
              <TimelinePostCard
                key={image._id}
                cardClassName={`${
                  index === data.length - 1 ? '' : 'mb-4'
                }`}
                imagePostedBy={image.userName}
                imagePostedOn={image.postedDate}
                imgcaption={image.caption}
                imgSrc={image.imageLink}
                commentType='normal'
                didCurrentUserLiked={didCurrentUserLiked(image.likedBy)}
                updateLikeCount={(flag) => updateLikeCount(image, flag)}
                imgLikes={image.likes}
                openCommentSection={() => openCommentSection(image)}
                commentSection={image.commentSection}
                shouldOpenCommentSection={openedCommentSectImgs.includes(image._id)}
                commentSectionClass="list-grp-custom-cls"
                includeAddNewComment={true}
                newComment={getCurrentCommentValue(image)}
                postNewCommentHandler={() => updateComment(image)}
                newCommentChangeHandler={(e) => {
                  if (
                    newCommentInImgs.some(
                      ({ id }) => image._id === id
                    )
                  ) {
                    const updateCommentImgs = [...newCommentInImgs]
                    updateCommentImgs.splice(
                      newCommentInImgs.findIndex(
                        ({ id }) => image._id === id
                      ),
                      1,
                      {
                        id: image._id,
                        comment: e.target.value
                      }
                    )
                    setNewCommentInImgs(updateCommentImgs)
                  } else {
                    setNewCommentInImgs([
                      ...newCommentInImgs,
                      {
                        id: image._id,
                        comment: e.target.value
                      }
                    ])
                  }
                }}
              />)}
        </div>
      )
    } else if (timelineState === 'FRIEND_LIST_VIEW') {
      return (
        <Tabs
          activeKey={frndReqTab}
          onSelect={(k) => setFrndReqTab(k)}
          className="py-3"
        >
          <Tab eventKey="My Friends" title="My Friends">
            <div className="pb-2">
            <ListGroup className='pb-2'>
              {
                friends.map(frnd => (
                  <ListGroup.Item key={frnd} className='d-flex align-items-center justify-content-between' style={{ borderRadius: 0 }}>
                    <div className="d-flex align-items-center">
                      <ProfileIcon className='mx-2' iconText={frnd.charAt(0).toUpperCase()} />
                      {frnd}
                    </div>
                    <Badge
                      className="cursor-pointer"
                      text="dark"
                      onClick={() => {
                        if (frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state.includes('LOADING')) return
                        handleUserFrndRelations(frnd, 'REMOVE_FRIEND')
                      }}
                   >
                      {
                        frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state.includes('LOADING')
                          ? 'Removing Friend'
                          : 'Remove Friend'
                      }
                    </Badge>
                  </ListGroup.Item>
                ))
              }
            </ListGroup>
            </div>
          </Tab>
          <Tab eventKey="Friend Requests" title="Friend Requests">
            {
              requestedBy.map(frnd => (
                <ListGroup.Item key={frnd} className='d-flex align-items-center justify-content-between' style={{ borderRadius: 0 }}>
                  <div className="d-flex align-items-center">
                    <ProfileIcon className='mx-2' iconText={frnd.charAt(0).toUpperCase()} />
                    {frnd}
                  </div>
                  <div className="d-flex">
                    {
                      <Badge
                        className="cursor-pointer me-2"
                        text="dark"
                        onClick = {() => {
                          if (frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state.includes('LOADING')) return
                          handleUserFrndRelations(frnd, 'ACCEPT_REQ')
                        }}
                      >
                        {
                          frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state === 'ACCEPT_REQ_LOADING'
                            ? 'Accepting Request'
                            : frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state === 'REJECT_REQ_LOADING'
                              ? 'Rejecting Request'
                              : 'Accept Request'
                        }
                      </Badge>
                    }
                    {
                      !(frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state.includes('LOADING')) &&
                      <Badge
                        className="cursor-pointer me-2"
                        text="dark"
                        onClick={() => handleUserFrndRelations(frnd, 'REJECT_REQ')}
                      >
                        Reject Request
                      </Badge>
                    }
                  </div>
                </ListGroup.Item>
              ))
            }
          </Tab>
          <Tab eventKey="Friend Requested Sent" title="Friend Request Sent">
            {
              requestedTo.map(frnd => (
                <ListGroup.Item key={frnd} className='d-flex align-items-center justify-content-between' style={{ borderRadius: 0 }}>
                  <div className="d-flex align-items-center">
                    <ProfileIcon className='mx-2' iconText={frnd.charAt(0).toUpperCase()} />
                    {frnd}
                  </div>
                  <Badge
                    className="cursor-pointer"
                    text="dark"
                    onClick={() => {
                      if (frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state.includes('LOADING')) return
                      handleUserFrndRelations(frnd, 'REVOKE_REQ')
                    }}
                  >
                    {
                      frndReqState.find(({ friend }) => friend === frnd) && frndReqState.find(({ friend }) => friend === frnd).state.includes('LOADING')
                        ? 'Revoking Request'
                        : 'Revoke Request'
                    }
                  </Badge>
                </ListGroup.Item>
              ))
            }
          </Tab>
        </Tabs>
      )
    } else if (timelineState === 'MESSAGE_VIEW') {
      return (<MessageView />)
    }
  }

  return (
    <StyledTimelineBody>
      <Container className={`timeline-body-container ${isFetching || isSuccess ? 'frnd-list-view' : ''}`}>
        {getTimelineContent()}
      </Container>
    </StyledTimelineBody>
  )
}

export default TimelineBody
