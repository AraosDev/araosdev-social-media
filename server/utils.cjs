const fetch = require('node-fetch');

exports.updateFrndAndCurrentUser = async (
  userReqBody,
  frndReqBody,
  frndId,
  req
) => {
  let updatedUserRes = {};
  let updatedFrndRes = {};

  if (Object.keys(userReqBody).length) {
    const updatedUser = await fetch(
      'https://auth-nz.onrender.com/api/v1/adsm/autnN/updateAccount/me',
      {
        method: 'PATCH',
        body: JSON.stringify(userReqBody),
        headers: {
          Authorization: req.headers.authorization,
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    );

    updatedUserRes = await updatedUser.json();
  }

  if (frndReqBody && Object.keys(frndReqBody).length) {
    const updatedFrnd = await fetch(
      `https://auth-nz.onrender.com/api/vautnN/updateAccount/${frndId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(frndReqBody),
        headers: {
          Authorization: req.headers.authorization,
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    );

    updatedFrndRes = await updatedFrnd.json();
  } else updatedFrndRes = { status: 'SUCCESS' };

  return { updatedUserRes, updatedFrndRes };
};
