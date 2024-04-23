import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import {
  currentUser,
  currentUserInfo,
  getCurrentToken,
  randomString,
  unixTimeToReadableFormat,
} from 'Common/helperFns';
import {
  transformTimeLineResponse,
  updateCommentTransformer,
  updateLikeCountTransformer,
} from 'Store/transformers/timelineTransformer';

export const appApiBaseURL =
  'https://araosdev-social-media-frontend.onrender.com';

export const adsmApiSlice = createApi({
  reducerPath: 'adsmMainReducer',
  baseQuery: fetchBaseQuery({ baseUrl: appApiBaseURL }),
  tagTypes: ['UPDATE_TIMELINE'],
  endpoints: (builder) => ({
    // Getting logged in user details
    loggedInUserInfo: builder.mutation<LoggedUserInfoApiRes, UserCredentials>({
      query: (userCredentials) => ({
        url: 'AUTHNZ/login',
        method: 'POST',
        body: userCredentials,
        credentials: 'include',
      }),
      transformResponse: (res: LoggedUserInfoApiRes) => {
        localStorage.setItem('userInfo', JSON.stringify({ ...res }));
        return { ...res };
      },
    }),
    // Logging out the current user
    logoutUser: builder.query<LogoutApiRes, null>({
      query: () => ({
        url: 'AUTHNZ/logout',
        headers: { Authorization: `Bearer ${getCurrentToken()}` },
        credentials: 'include',
      }),
    }),
    // Creating an user account API
    createAccount: builder.mutation<
      CreateAccountSucessRes | CreateAccountErrRes,
      CreateAccountPayload
    >({
      query: (createAccountpayload) => ({
        url: 'AUTHNZ/signup',
        method: 'POST',
        body: createAccountpayload,
        credentials: 'include',
      }),
      transformErrorResponse: (errorRes) => {
        const { data } = errorRes as { data: Partial<CreateAccountErrRes> };
        return {
          status: typeof data.status === 'number' ? data.status : 400,
          updated: typeof data.updated === 'string' ? data.updated : 'FAILED',
          message:
            typeof data.message === 'string' ? data.message : 'UNKNOWN_ERROR',
        };
      },
    }),
    // Sending a reset token API to the mail box
    forgotPassword: builder.query<ForgotPasswordApiRes, string>({
      query: (userDetail) => `AUTHNZ/forgotPassword?userDetail=${userDetail}`,
    }),
    // Reset password API
    resetPassword: builder.mutation<ForgotPasswordApiRes, ResetPwdReq>({
      query: (reqBody) => {
        const { password, confirmPassword, token } = reqBody;
        return {
          url: `AUTHNZ/resetPassword/${token}`,
          method: 'PATCH',
          body: { password, confirmPassword },
          credentials: 'include',
        };
      },
    }),
    // Updating the current user info
    updateCurrentUserInfo: builder.mutation<UpdateUserInfoApiRes, FormData>({
      query: (userInfoPayload) => ({
        url: 'AUTHNZ/updateAccount/me',
        method: 'PATCH',
        body: userInfoPayload,
        headers: { Authorization: `Bearer ${getCurrentToken()}` },
      }),
    }),
    // Updating the current user's password
    updateCurrentUserPassword: builder.mutation<
      UpdateUserPwdApiRes,
      UpdateUserPwdApiReq
    >({
      query: (userPwdPayload) => ({
        url: 'AUTHNZ/updatePassword/me',
        method: 'PATCH',
        body: userPwdPayload,
        headers: { Authorization: `Bearer ${getCurrentToken()}` },
        credentials: 'include',
      }),
      transformResponse: (res: UpdateUserPwdApiRes) => {
        const oldUserInfo = JSON.parse(localStorage.getItem('userInfo') || '');
        const newUserInfo = { ...oldUserInfo, token: res.token };
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo));

        return res;
      },
    }),
    // Getting timeline image APIs
    getTimeLineImgs: builder.query<TransformedTimelineImgRes[], undefined>({
      query: () => {
        return {
          url: `/gcp-apis/timeline-images`,
          method: 'GET',
          headers: { Authorization: `Bearer ${getCurrentToken()}` },
        };
      },
      providesTags: ['UPDATE_TIMELINE'],
      transformResponse: (res) => {
        return transformTimeLineResponse(res as TimeLineImgApiRes)
          .trnsformedResponse;
      },
    }),
    // Posting an image in timeline API
    postTimelineImg: builder.mutation<
      TransformedTimelineImgRes,
      PostTimelineImgPayload
    >({
      query: (postTimelineImgReq) => {
        const { file, caption } = postTimelineImgReq;
        const body = new FormData();
        body.append('file', file);
        return {
          url: `/gcp-apis/timeline-images?caption=${caption}`,
          method: 'POST',
          body,
          headers: { Authorization: `Bearer ${getCurrentToken()}` },
        };
      },
      invalidatesTags: ['UPDATE_TIMELINE'],
      transformResponse: (response: PostTimelineImgRes, _meta, arg) => {
        const { caption, file } = arg;
        const newTimelineData = {
          userName: currentUser(),
          image: response.status === 'UPLOADED' ? file.name : '',
          imageName:
            response.status === 'UPLOADED'
              ? file.name
                  .split('.jpg')
                  .join('')
                  .split('jpeg')
                  .join('')
                  .split('png')[0]
              : '',
          postedDate:
            response.status === 'UPLOADED'
              ? unixTimeToReadableFormat(
                  Math.round(new Date().getTime() / 1000)
                )
              : '',
          postedOn:
            response.status === 'UPLOADED'
              ? Math.round(new Date().getTime() / 1000)
              : NaN,
          likes: '0',
          likedBy: [],
          caption,
          commentSection: [],
          userPhoto: currentUserInfo().photo || '',
          _id: randomString(10),
        };

        return newTimelineData;
      },
    }),
    // Updating a like count (Increment/Decrement)
    updateLikeCount: builder.mutation<UpdateLikeCountRes, UpdateLikeReqBody>({
      query: (body) => {
        const { postId, likedFlag } = body;
        return {
          url: `/gcp-apis/timeline-images/updateLike`,
          method: 'PATCH',
          body: { postId, likedFlag },
          headers: { Authorization: `Bearer ${getCurrentToken()}` },
        };
      },
      onQueryStarted(reqBody, { dispatch, queryFulfilled }) {
        const updatedData = dispatch(
          adsmApiSlice.util.updateQueryData(
            'getTimeLineImgs',
            undefined,
            (posts) => {
              return updateLikeCountTransformer(
                posts,
                reqBody.imgDetail,
                reqBody.likedFlag
              ).allTimelineImages;
            }
          )
        );
        queryFulfilled.catch(updatedData.undo);
      },
    }),
    // Adding a comment API
    updateComment: builder.mutation<UpdateCommentRes, UpdateCommentReqBody>({
      query: (body) => {
        const { postId, comment } = body;
        return {
          url: `/gcp-apis/timeline-images/updateComment`,
          method: 'PATCH',
          body: { postId, comment },
          headers: { Authorization: `Bearer ${getCurrentToken()}` },
        };
      },
      onQueryStarted(reqBody, { dispatch, queryFulfilled }) {
        const updatedData = dispatch(
          adsmApiSlice.util.updateQueryData(
            'getTimeLineImgs',
            undefined,
            (posts) => {
              return updateCommentTransformer(
                posts,
                reqBody.imgDetail,
                reqBody.comment
              );
            }
          )
        );
        reqBody.onCacheUpdate();
        queryFulfilled.catch(updatedData.undo);
      },
    }),
    // Searching friend list API
    searchFriendList: builder.query<TransFormedFrndSearchList, string>({
      query: (searchKey) => {
        return {
          url: `AUTHNZ/searchUsers/${searchKey}`,
          method: 'GET',
          headers: { Authorization: `Bearer ${getCurrentToken()}` },
        };
      },
      transformResponse: (response: FrndListSearchRes) => {
        const { status, users } = response;
        if (status === 'SUCCESS') {
          return users.map((frnd, index) => ({
            value: frnd.userName,
            valueId: index,
            ...frnd,
          }));
        }
        return 'ERROR';
      },
      transformErrorResponse: (errorRes) => {
        const { data } = errorRes as {
          data: Pick<FrndListSearchRes, 'status'> & { message: string };
        };
        if (
          data.status === 'FAILED' &&
          data.message === 'No Users match the searchKey'
        )
          return 'EMPTY';
        return 'ERROR';
      },
    }),
    // Sending Friend request API
    friendRequest: builder.mutation<string, frndRequestReq>({
      query: (reqBody) => {
        const { friendDetails, userDetails, requestType } = reqBody;
        return {
          url: `/friendReq/${requestType}`,
          method: 'POST',
          body: { friendDetails, userDetails },
          headers: { Authorization: `Bearer ${getCurrentToken()}` },
        };
      },
      transformResponse: (
        response: { status: string; user: UserInfo },
        _meta,
        arg
      ) => {
        const { requestType } = arg;
        const { status, user } = response;
        if (status === 'SUCCESS') {
          const existingUserInfo = currentUserInfo();
          let newUserInfo;
          switch (requestType) {
            case 'SEND_REQ': {
              newUserInfo = {
                ...existingUserInfo,
                friendRequests: {
                  ...existingUserInfo.friendRequests,
                  requestedTo: [...user.friendRequests.requestedTo],
                },
              };
              break;
            }
            case 'REVOKE_REQ': {
              newUserInfo = {
                ...existingUserInfo,
                friendRequests: {
                  ...existingUserInfo.friendRequests,
                  requestedTo: user.friendRequests.requestedTo,
                },
              };
              break;
            }
            case 'ACCEPT_REQ':
            case 'REJECT_REQ': {
              newUserInfo = {
                ...existingUserInfo,
                friendRequests: {
                  ...existingUserInfo.friendRequests,
                  requestedBy: user.friendRequests.requestedBy,
                },
              };
              break;
            }
            case 'REMOVE_FRIEND': {
              newUserInfo = {
                ...existingUserInfo,
                friends: user.friends,
              };
              break;
            }
            default:
              break;
          }
          localStorage.setItem(
            'userInfo',
            JSON.stringify({
              user: { ...newUserInfo },
              status: 'SUCCESS',
              token: getCurrentToken(),
            })
          );
          return '';
        }
        return 'ERROR';
      },
      transformErrorResponse: () => 'ERROR',
    }),
  }),
});

export const {
  useGetTimeLineImgsQuery,
  useLoggedInUserInfoMutation,
  useLazyLogoutUserQuery,
  useLazyForgotPasswordQuery,
  useResetPasswordMutation,
  useUpdateCurrentUserInfoMutation,
  useUpdateCurrentUserPasswordMutation,
  useCreateAccountMutation,
  usePostTimelineImgMutation,
  useUpdateLikeCountMutation,
  useUpdateCommentMutation,
  useSearchFriendListQuery,
  useFriendRequestMutation,
} = adsmApiSlice;
