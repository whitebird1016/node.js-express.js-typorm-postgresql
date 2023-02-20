import { Request, Response } from "express";
import bcrypt, { hash } from "bcryptjs";
import { AppDataSource } from "../connection/data-source";
import User from "../entity/User";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../constants";
import jwt_decode from "jwt-decode";

export const getUser = async (req: Request, res: Response) => {
  const { accessToken } = req.body;
  const decoded: any = jwt_decode(accessToken);
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    email: decoded.mail,
  });
  return res.status(200).json({
    user,
  });
};

export const refresh_token = async (req: Request, res: Response) => {
  // check if refresh token is present

  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  //verify refresh token
  jwt.verify(refreshToken, REFRESH_SECRET, async (err: any, user: any) => {
    if (err) {
      return res.sendStatus(401);
    }
    const accessToken = await jwt.sign({ user }, JWT_SECRET, {
      expiresIn: "1m",
    });
    return res.status(200).json({
      accessToken,
    });
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email)
    return res.status(400).json({
      message: "Please Enter Your Email",
    });
  if (!password)
    return res.status(400).json({
      message: "Please Enter Your Password",
    });
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({
    email: email,
  });
  if (!user) {
    return res.status(400).json({
      message: "User is not found",
    });
  } else {
    if (user?.password) {
      bcrypt.compare(password, user?.password, async (err, response) => {
        if (response === true) {
          const payload = {
            mail: user.email,
          };
          const accessToken = await jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1m",
          });
          const refreshToken = await jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: "10m",
          });

          // set refresh token as cookie
          return res.status(200).json({
            accessToken,
            user,
            refreshToken,
          });
        } else {
          return res.status(400).json({
            message: "Password is incorrect",
          });
        }
      });
    } else {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }
  }
};

export const addNewUser = async (req: Request, res: Response) => {
  const {
    firstname,
    lastname,
    email,
    address1,
    address2,
    city,
    state,
    phone,
    password,
  } = req.body;

  if (!firstname)
    return res.status(400).json({
      message: "Please Enter Your Firstname",
    });
  if (!lastname)
    return res.status(400).json({
      message: "Please Enter Your Lastname",
    });
  if (!address1)
    return res.status(400).json({
      message: "Please Enter Your Address1",
    });
  if (!city)
    return res.status(400).json({
      message: "Please Enter Your City",
    });
  if (!state)
    return res.status(400).json({
      message: "Please Enter Your State",
    });
  if (!phone)
    return res.status(400).json({
      message: "Please Enter Your Phone",
    });
  if (!password)
    return res.status(400).json({
      message: "Please Enter Your Password",
    });
  const userRepository = AppDataSource.getRepository(User);

  const checkuser = await userRepository.findOneBy({
    email: email,
  });

  if (checkuser) {
    return res.status(400).json({
      message: "User Duplicate",
    });
  } else {
    let user = new User();
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.address1 = address1;
    user.address2 = address2 || "";
    user.city = city;
    user.state = state;
    user.phone = phone;
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        user.password = hash; // Or however suits your setup
        await AppDataSource.manager.save(user);
        const payload = {
          id: user.id,
        };
        const accessToken = await jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1m",
        });
        const refreshToken = await jwt.sign(payload, REFRESH_SECRET, {
          expiresIn: "10m",
        });
        return res.status(200).json({
          accessToken,
          refreshToken,
          user,
        });
      });
    });
  }
};
