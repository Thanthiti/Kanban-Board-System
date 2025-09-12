const UserRepository = require("../repositories/user.repository");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const logger = require("../config/logger");

async function register(name, email, password) {
  try {
    const userExists = await UserRepository.findbyEmail(email);
    if (userExists) {
      logger.error(`Registration failed - User already exists - ${email}`);
      throw new Error("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    logger.info(`Registration successful - ${email}`);
    const token = generateToken({ id: user.id, email: user.email });
    return {user: { id: user.id, name: user.name, email: user.email }, token};
  } catch (error) {
    logger.error(`Registration failed - ${error.message}`);
    throw error;
  }
}

async function login(email, password) {
  try {
    const user = await UserRepository.findbyEmail(email);
    if (!user) {
      logger.warn(`Login failed - User not found - ${email}`);
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.warn(`Login failed - Invalid password - ${email}`);
      throw new Error("Invalid password");
    }

    logger.info(`Login successful - ${email}`);
    const token = await generateToken({ id: user.id, name: user.name });
    return { user: { id: user.id, name: user.name }, token };
  } catch (error) {
    logger.error(`Login failed - ${error.message}`);
    throw error;
  }
}


  async function getProfile(userID) {
    try {
      const user = await UserRepository.findbyId(userID);
      if (!user) {
        logger.warn(`Profile failed - User not found - ${userID}`);
        throw new Error("User not found");
      }
      logger.info(`Profile successful - ${userID}`);
      return {id: user.id, name: user.name, email: user.email };
    } catch (error) {
      logger.error(`Profile failed - ${error.message}`);
      throw error;
    }
  }

module.exports = { register, login, getProfile};
