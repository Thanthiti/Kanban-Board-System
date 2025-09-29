const {login, register, getProfile} = require("../../services/user.service");
const { successResponse, errorResponse } = require("../../config/response");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json(errorResponse(400, "Bad request"));
    }
    const user = await register(name, email, password);
    res.status(201).json(successResponse(user));
  } catch (error) {
    res
      .status(error.code || 400)
      .json(errorResponse(error.code || 400, error.message));
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(errorResponse(400, "Bad request"));
    }
    const user = await login(email, password);
    res.status(200).json(successResponse(user));
  } catch (error) {
    res
      .status(error.code || 400)
      .json(errorResponse(error.code || 400, error.message));
  }
}

async function ProfileUser(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json(errorResponse(401, "Unauthorized"));
    }

    const profile = await getProfile(req.user.id);
    res.status(200).json(successResponse(profile));
  } catch (error) {
    res
      .status(error.code || 400)
      .json(errorResponse(error.code || 400, error.message));
  }
}

module.exports = { registerUser, loginUser, ProfileUser };
