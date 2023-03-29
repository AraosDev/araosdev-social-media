interface TimelineImages {
  _id: string
  userName: string
  image: string
  postedOn: number
  likes: string
  likedBy: Array<{ user: string, likedOn: number }>
  caption: string
  commentSection: Array<{ comment: string, commentedOn: number, userName: string }>
}
interface TimeLineImgApiRes {
  timelineImages: TimelineImages[]
  imagePrefixUrl: 'https://storage.googleapis.com/araosdev-social-media.appspot.com'
}

interface TransformedTimelineImgRes extends TimelineImages {
  imageLink: string
  postedDate: string
  imageName: string
}

interface PostTimelineImgPayload {
  username: TimelineImages['userName']
  file: Blob
  caption: string
}

interface PostTimelineImgRes {
  status: string
}

interface UpdateLikeReqBody {
  likedFlag: 'INCREMENT' | 'DECREMENT'
  postName: string
  postedBy: TimelineImages['userName']
  imgDetail: TransformedTimelineImgRes
}

interface UpdateCommentReqBody extends Omit<UpdateLikeReqBody, 'likedFlag'> {
  comment: string
  onCacheUpdate: () => void
}

interface UpdateLikeCountRes {
  status: string
  updates: {
    likes: string
    likedBy: Array<{ user: string, likedOn: number }>
  }
}

interface UpdateCommentRes {
  status: string
  updates: {
    commentSection: Array<{ userName: string, comment: string, commentedOn: number }>
  }
}
