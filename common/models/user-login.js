'use strict';
const bcrypt = require('bcryptjs');

module.exports = function (Userlogin) {
  Userlogin.customLogin = async function (params, res) {
    try {
      const { username, password } = params;
      if (!username || !password) {
        const defaultError = new Error("Incorrect username and/or password");
        res.code = 404;
        return defaultError;
      }

      const userDetails = await Userlogin.findOne({ where: { username: username } });
      // console.log('userDetails', userDetails);
      console.log('userDetails ty', typeof userDetails);

      if (!userDetails || userDetails === null) {
        const defaultError = new Error("user with specified username is not found");
        defaultError.statusCode = 409;
        return defaultError;
      } else {
        // const isPasswordMatched = bcrypt.compareSync(password, userDetails.password);
        if (userDetails.password === password) {
          const result = { ...userDetails?.__data };
          delete result['password'];
          delete result['viewPassword'];
          console.log('result', result);
          return {
            statusCode: 200,
            code: 'Login success',
            res: result
          };
        } else {
          return {
            statusCode: 409,
            code: 'Conflict',
            res: undefined
          };
        }
      }
    } catch (e) {
      return err;
    }
  };

  Userlogin.remoteMethod('customLogin', {
    description: 'custom login for users with username and password',
    accepts: [
      { arg: 'params', type: 'object', require: true, http: { 'source': 'body' } },
      { arg: 'res', type: 'object', http: { source: 'res' } }],
    returns: {
      root: true,
      type: 'object'
    },
    http: {
      verb: 'post'
    },
  });
};
