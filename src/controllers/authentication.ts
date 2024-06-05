import express from "express";
import { authentication, random } from "../helpers";
import { createUser, getUserByEmail } from "../model/user";

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
