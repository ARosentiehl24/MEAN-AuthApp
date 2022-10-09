const { request, response } = require("express");

const jwt = require("jsonwebtoken");

const ApiResponse = require("../models/Response");

const validateJwt = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res
      .status(401)
      .json(ApiResponse.return(false, "The user is not authorized"));
  }

  try {
    const { _id, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    req._id = _id;
    req.name = name;
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ApiResponse.return(false, "Something went wrong: Token not valid"));
  }

  next();
};

module.exports = {
  validateJwt,
};
