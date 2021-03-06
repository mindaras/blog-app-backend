const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const { UserPoolId, ClientId } = require("../config");
global.fetch = require("node-fetch");

module.exports = (req, res) => {
  const { username, token } = req.body;
  const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({
    RefreshToken: token
  });
  const poolData = { UserPoolId, ClientId };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  const userData = { Username: username, Pool: userPool };
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.refreshSession(refreshToken, (err, session) => {
    if (err) res.send(500, err);
    else
      res.send(
        200,
        JSON.stringify({
          username,
          name: session.getIdToken().payload.name,
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken()
        })
      );
  });
};
