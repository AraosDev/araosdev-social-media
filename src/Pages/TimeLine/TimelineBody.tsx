/* eslint-disable import/order */
/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import { Container } from 'react-bootstrap';

import styled from 'styled-components';

import { Loader } from '../../Common/DataTransitionHandlers';
import TimelinePostCard from '../../Common/TimelinePostCard';

import { didCurrentUserLiked } from './HelperFns';

import {
  useGetTimeLineImgsQuery,
  useUpdateCommentMutation,
  useUpdateLikeCountMutation,
} from 'Store/apiSlices/mainAPISlice';

const StyledTimelineBody = styled.div`
  max-height: calc(100vh - 85px);
  min-height: calc(100vh - 85px);
  overflow: auto;
  .frnd-list-view {
    min-height: calc(100vh - 85px);
  }
  .timeline-body-container {
    background-color: #ccccff;
    border-left: 1px solid #5d3fd3 !important;
    border-right: 1px solid #5d3fd3 !important;
    width: 750px;
    .loader-element {
      height: calc(100vh - 85px);
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
    .bg-primary {
      background-color: #ccccff !important;
      border: 1px solid #5d3fd3 !important;
    }
  }
`;

function TimelineBody(): React.ReactElement {
  const { isLoading, isSuccess, data } = useGetTimeLineImgsQuery(undefined);
  const [updateLikeCountFn] = useUpdateLikeCountMutation();
  const [updateCommentFn] = useUpdateCommentMutation();

  const [openedCommentSectImgs, setOpenCommentSecImgs] = useState<string[]>([]);
  const [newCommentInImgs, setNewCommentInImgs] = useState<
    { id: string; comment: string }[]
  >([]);

  const updateLikeCount = (
    imgDetail: TransformedTimelineImgRes,
    flag: UpdateLikeReqBody['likedFlag']
  ) => {
    const reqBody = {
      likedFlag: flag,
      postId: imgDetail._id,
      imgDetail,
    };
    updateLikeCountFn(reqBody).unwrap();
  };

  const openCommentSection = (imgDetail: TransformedTimelineImgRes) => {
    const { _id } = imgDetail;
    if (openedCommentSectImgs.includes(_id)) {
      setOpenCommentSecImgs([
        ...openedCommentSectImgs.filter((id) => id !== _id),
      ]);
    } else setOpenCommentSecImgs([...openedCommentSectImgs, _id]);
  };

  const updateComment = (imgDetail: TransformedTimelineImgRes) => {
    const { comment = '' } =
      newCommentInImgs.find(({ id }) => imgDetail._id === id) || {};
    if (comment) {
      const reqBody = {
        postId: imgDetail._id,
        comment,
        imgDetail,
        onCacheUpdate: () => {
          setNewCommentInImgs(
            newCommentInImgs.filter(({ id }) => imgDetail._id !== id)
          );
        },
      };
      updateCommentFn(reqBody).unwrap();
    }
  };

  const getCurrentCommentValue = (imgDetail: TransformedTimelineImgRes) => {
    const { comment = '' } =
      newCommentInImgs.find(({ id }) => imgDetail._id === id) || {};
    if (comment) return comment;
    return '';
  };

  const getTimelineContent = () => {
    if (isLoading) {
      return (
        <Loader
          className="loader-element caveatBold"
          message="Loading your feeds . . ."
        />
      );
    }
    if (isSuccess) {
      return (
        <div className="py-3">
          {data?.map((image, index) => (
            <TimelinePostCard
              key={image._id}
              cardClassName={`${index === data.length - 1 ? '' : 'mb-4'}`}
              imagePostedBy={image.userName}
              imagePostedOn={image.postedDate}
              profileDp={image.userPhoto}
              imgcaption={image.caption}
              imgSrc={image.image}
              commentType="normal"
              didCurrentUserLiked={didCurrentUserLiked(image.likedBy)}
              updateLikeCount={(flag) => updateLikeCount(image, flag)}
              imgLikes={image.likes}
              openCommentSection={() => openCommentSection(image)}
              commentSection={image.commentSection}
              shouldOpenCommentSection={openedCommentSectImgs.includes(
                image._id
              )}
              commentSectionClass="list-grp-custom-cls"
              includeAddNewComment
              newComment={getCurrentCommentValue(image)}
              postNewCommentHandler={() => updateComment(image)}
              newCommentChangeHandler={(e) => {
                if (newCommentInImgs.some(({ id }) => image._id === id)) {
                  const updateCommentImgs = [...newCommentInImgs];
                  updateCommentImgs.splice(
                    newCommentInImgs.findIndex(({ id }) => image._id === id),
                    1,
                    {
                      id: image._id,
                      comment: e.target.value,
                    }
                  );
                  setNewCommentInImgs(updateCommentImgs);
                } else {
                  setNewCommentInImgs([
                    ...newCommentInImgs,
                    {
                      id: image._id,
                      comment: e.target.value,
                    },
                  ]);
                }
              }}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <StyledTimelineBody>
      <Container
        className={`timeline-body-container ${
          isLoading || isSuccess ? 'frnd-list-view' : ''
        }`}
      >
        {getTimelineContent()}
      </Container>
    </StyledTimelineBody>
  );
}

export default TimelineBody;
