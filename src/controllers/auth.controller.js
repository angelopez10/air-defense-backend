import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken"
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { rut, fullName, phoneNumber, address, email, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      rut,
      fullName,
      phoneNumber,
      address,
      email,
      password: encryptedPassword,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

    res.cookie("token", token);

    res.json({
      id: userSaved._id,
      rut: userSaved.rut,
      fullName: userSaved.fullName,
      phoneNumber: userSaved.phoneNumber,
      address: userSaved.address,
      email: userSaved.email,
      isAdmin: userSaved.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) return res.status(400).json({ message: "User not found" });

    const matchPassword = await bcrypt.compare(password, userFound.password);

    if (!matchPassword)
      return res.status(401).json({ message: "Invalid password" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      httpOnly: false
    });
    res.json({
      id: userFound._id,
      rut: userFound.rut,
      fullName: userFound.fullName,
      phoneNumber: userFound.phoneNumber,
      address: userFound.address,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: "User not found" });

  return res.json({
    id: userFound._id,
    rut: userFound.rut,
    fullName: userFound.fullName,
    phoneNumber: userFound.phoneNumber,
    address: userFound.address,
    email: userFound.email,
    isAdmin: userFound.isAdmin,
  });
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      isAdmin: userFound.isAdmin
    });
  });
};
