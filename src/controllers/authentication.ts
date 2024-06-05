import express from "express";
import { authentication, random } from "../helpers";
import { createUser, getUserByEmail } from "../model/user";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }
    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );
    await user.save();
    res.cookie("Test_NODE", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      return res.sendStatus(400);
    }
    const existUser = await getUserByEmail(email);
    if (existUser) {
      return res.sendStatus(400);
    }
    const salt = random();
    const user = await createUser({
      userName,
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
