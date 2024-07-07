const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const cors = require('cors');
const { updateFrndAndCurrentUser } = require('./utils.cjs');

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://araosdev-social-media-frontend.onrender.com',
    ],
    credentials: true,
  })
);
app.post(
  '/friendReq/:reqType',
  express.json({ limit: '10kb' }),
  express.urlencoded({ extended: true, limit: '10kb' }),
  async (req, res) => {
    try {
      const { reqType } = req.params;
      let userReqBody;
      let frndReqBody;
      const { userDetails, friendDetails } = req.body;
      if (reqType === 'SEND_REQ') {
        userReqBody = {
          friendRequests: {
            requestedTo: [
              ...userDetails.friendRequests.requestedTo.map(({ id }) => id),
              friendDetails.id,
            ],
            requestedBy: [...userDetails.friendRequests.requestedBy].map(
              ({ id }) => id
            ),
          },
        };

        frndReqBody = {
          friendRequests: {
            requestedTo: [...userDetails.friendRequests.requestedTo],
            requestedBy: [
              ...userDetails.friendRequests.requestedBy,
              userDetails.id,
            ],
          },
        };
      }

      if (reqType === 'REJECT_REQ') {
        userReqBody = {
          friendRequests: {
            requestedBy: [...userDetails.friendRequests.requestedBy]
              .filter(({ id }) => id !== friendDetails.id)
              .map(({ id }) => id),
            requestedTo: userDetails.friendRequests.requestedTo.map(
              ({ id }) => id
            ),
          },
        };

        frndReqBody = {
          friendRequests: {
            requestedTo: [...friendDetails.friendRequests.requestedTo].filter(
              (id) => id !== userDetails.id
            ),
            requestedBy: friendDetails.friendRequests.requestedBy.map(
              ({ id }) => id
            ),
          },
        };
      }

      if (reqType === 'REVOKE_REQ') {
        userReqBody = {
          friendRequests: {
            requestedBy: userDetails.friendRequests.requestedBy,
            requestedTo: userDetails.friendRequests.requestedTo.filter(
              ({ id }) => id !== friendDetails.id
            ),
          },
        };

        frndReqBody = {
          friendRequests: {
            requestedBy: friendDetails.friendRequests.requestedBy.filter(
              (id) => id !== userDetails.id
            ),
            requestedTo: friendDetails.friendRequests.requestedTo,
          },
        };
      }

      if (reqType === 'ACCEPT_REQ') {
        userReqBody = {
          friendRequests: {
            requestedBy: userDetails.friendRequests.requestedBy.filter(
              ({ id }) => id !== friendDetails.id
            ),
            requestedTo: userDetails.friendRequests.requestedTo,
          },
        };

        frndReqBody = {
          friends: [...friendDetails.friends, userDetails.id],
          friendRequests: {
            requestedBy: friendDetails.friendRequests.requestedBy,
            requestedTo: friendDetails.friendRequests.requestedTo.filter(
              (id) => id !== userDetails.id
            ),
          },
        };
      }

      if (reqType === 'REMOVE_FRIEND') {
        userReqBody = {
          friends: userDetails.friends.filter(
            ({ id }) => id !== friendDetails.id
          ),
        };
      }

      const { updatedUserRes, updatedFrndRes } = await updateFrndAndCurrentUser(
        userReqBody,
        frndReqBody,
        friendDetails.id,
        req
      );

      if (
        updatedUserRes.status === 'SUCCESS' &&
        updatedFrndRes.status === 'SUCCESS'
      ) {
        res
          .status(200)
          .json({ status: updatedUserRes.status, user: updatedUserRes.user });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'FAILED', message: e.message });
    }
  }
);

const apiProxy = createProxyMiddleware({
  router: (req) => {
    console.log(req.originalUrl);
    if (req.originalUrl.includes('AUTHNZ'))
      return 'https://auth-nz.onrender.com/api/v1/adsm/';
    return 'https://araosdev-social-media-backend.onrender.com/araosdevsm/';
  },
  changeOrigin: true,
  pathRewrite(path) {
    return path.replace('AUTHNZ', 'autnN').replace('ADSM', '');
  },
});

app.use('*', apiProxy);

app.listen(3001);
