const jwt = require("jsonwebtoken");

const generateJwt = (_id, name) => {
  const payload = { _id, name };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: "24h",
      },
      (error, token) => {
        if (error) {
          console.log("Error: ", error);

          reject(error);
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJwt,
};
