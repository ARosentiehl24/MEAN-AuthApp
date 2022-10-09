const { request, response } = require("express");

const ApiResponse = require("../models/Response");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJwt } = require("../helpers/jwt");

const createUser = async (req = request, res = response) => {
  const { name, email, password } = req.body;

  try {
    //Verify if email already exists

    const user = await User.findOne({
      email,
    });

    if (user) {
      return res
        .status(400)
        .json(
          ApiResponse.return(
            false,
            "The user with the email provided already exists"
          )
        );
    }

    //Create user with our model

    const dbUser = new User(req.body);

    //Encrypt the password

    const salt = await bcrypt.genSalt();

    dbUser.password = await bcrypt.hash(password, salt);

    //Generate JWT

    const token = await generateJwt(dbUser.id, name);

    //Creat user in DB

    await dbUser.save();

    //Generate response

    //TODO: Remove password from model
    // delete dbUser.password;

    return res.status(201).json(
      ApiResponse.return(true, "User created successfully", {
        user: {
          _id: dbUser.id,
          name,
          email,
        },
        token,
      })
    );
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ApiResponse.return(false, "Something went wrong"));
  }
};

const userLogin = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    //Find user in db

    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res
        .status(400)
        .json(ApiResponse.return(false, "The email does not exists"));
    }

    //Confirm if password match

    const validPassword = await bcrypt.compare(password, dbUser.password);

    if (!validPassword) {
      return res
        .status(400)
        .json(ApiResponse.return(false, "The password does not match"));
    }

    //Generate JWT

    const token = await generateJwt(dbUser.id, dbUser.name);

    //Generate response

    //TODO: Remove password from model
    // delete dbUser.password;

    return res.json(
      ApiResponse.return(true, "User logged in successfully", {
        user: {
          _id: dbUser.id,
          name: dbUser.name,
          email,
        },
        token,
      })
    );
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ApiResponse.return(false, "Something went wrong"));
  }
};

const token = async (req = request, res = response) => {
  try {
    const { _id, name } = req;

    //Read db to get email

    const dbUser = await User.findById(_id);

    //Renew token

    const token = await generateJwt(_id, name);

    //Generate response

    return res.json(
      ApiResponse.return(true, "Token renewed", {
        user: { _id, name, email: dbUser.email },
        token,
      })
    );
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(ApiResponse.return(false, "Something went wrong"));
  }
};

module.exports = {
  createUser,
  token,
  userLogin,
};
