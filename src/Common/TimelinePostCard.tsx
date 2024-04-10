/* eslint-disable react/jsx-props-no-spreading */
import { Badge, Card, Form, ListGroup } from 'react-bootstrap';
import { BsChat, BsFillHeartFill, BsHeart } from 'react-icons/bs';

import { currentUser, unixTimeToReadableFormat } from './helperFns';
import ProfileIcon from './ProfileIcon';

function TimelinePostCard({
  cardClassName = '',
  cardStyle = {},
  imagePostedBy = '',
  imagePostedOn,
  imgcaption,
  imgSrc,
  commentType = 'normal',
  didCurrentUserLiked,
  updateLikeCount,
  imgLikes,
  openCommentSection,
  commentSection,
  shouldOpenCommentSection,
  commentSectionClass = '',
  customCommentComponent,
  includeAddNewComment,
  newComment,
  newCommentChangeHandler,
  postNewCommentHandler,
  noImgAvailableText = '',
  profileDp = '',
  ...cardProps
}: TimelinePostCardProps) {
  return (
    <Card className={cardClassName} style={cardStyle} {...cardProps}>
      <Card.Header className="d-flex">
        <ProfileIcon
          profileDp={profileDp || 'DEFAULT'}
          iconText={imagePostedBy.charAt(0).toUpperCase()}
        />
        <div
          className="d-flex flex-column ms-2"
          style={{ fontSize: 13, fontWeight: 700 }}
        >
          <span>{imagePostedBy}</span>
          <span>{imagePostedOn}</span>
        </div>
      </Card.Header>
      <Card.Body>
        <Card.Subtitle className="mb-3">{imgcaption}</Card.Subtitle>
        {imgSrc ? (
          <Card.Img
            aria-label={`posted-img-${imgSrc}`}
            style={{ width: '100%', height: 600, objectFit: 'cover' }}
            src={imgSrc}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              fontSize: 24,
              color: 'grey',
            }}
            className="d-flex justify-content-center align-items-center"
          >
            {noImgAvailableText}
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        {didCurrentUserLiked ? (
          <BsFillHeartFill
            onClick={() => updateLikeCount('DECREMENT')}
            size={25}
            className="me-2 cursor-pointer"
            color="red"
          />
        ) : (
          <BsHeart
            onClick={() => updateLikeCount('INCREMENT')}
            size={25}
            className="me-2 cursor-pointer"
          />
        )}
        {imgLikes} likes
        <BsChat
          onClick={openCommentSection}
          size={24}
          className="mx-2 cursor-pointer"
        />
        {commentSection.length} comments
        {shouldOpenCommentSection && commentType === 'normal' ? (
          <ListGroup
            className={`my-2 p-2 list-group-flush ${commentSectionClass}`}
          >
            {commentSection.map((comment) => (
              <ListGroup.Item key={comment.comment} className="d-flex">
                <ProfileIcon
                  iconText={comment.userName.charAt(0).toUpperCase()}
                  iconSize="28px"
                  profileDp={comment.userPhoto || 'DEFAULT'}
                />
                <span
                  className="ms-2 d-flex justify-content-between"
                  style={{ fontSize: 14, width: '100%' }}
                >
                  <div>
                    <span style={{ fontWeight: 'bold' }}>
                      {comment.userName}:
                    </span>
                    <span>&nbsp;{comment.comment}</span>
                  </div>
                  <span
                    className="ms-2"
                    style={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {unixTimeToReadableFormat(comment.commentedOn)}
                  </span>
                </span>
              </ListGroup.Item>
            ))}
            {includeAddNewComment ? (
              <ListGroup.Item className="d-flex">
                <ProfileIcon
                  iconText={currentUser().charAt(0).toUpperCase()}
                  iconSize="28px"
                  className="me-2 profile-comment"
                />
                <Form.Control
                  style={{ flex: 20 }}
                  placeholder="Add your comment"
                  value={newComment}
                  onChange={newCommentChangeHandler}
                />
                <div style={{ flex: 2 }}>
                  <Badge
                    className="ms-2 cursor-pointer"
                    text="dark"
                    style={{ background: 'rgb(204,204,255)' }}
                    onClick={postNewCommentHandler}
                  >
                    Post
                  </Badge>
                </div>
              </ListGroup.Item>
            ) : null}
          </ListGroup>
        ) : shouldOpenCommentSection && commentType === 'custom' ? (
          typeof customCommentComponent === 'function' ? (
            customCommentComponent()
          ) : null
        ) : null}
      </Card.Footer>
    </Card>
  );
}

export default TimelinePostCard;
