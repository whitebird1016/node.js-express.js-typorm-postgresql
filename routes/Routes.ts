import { Request, Response } from "express";
import {
  refresh_token,
  addNewUser,
  getUser,
  login,
} from "../controller/controller";
const Routes = (app: any) => {
  app.route("/").get((request: Request, response: Response) => {
    response.status(200).send({
      message: "GET request successfully.",
    });
  });
  app.route("/user").post(getUser);
  app.route("/login").post(login);
  app.route("/refresh_token").post(refresh_token);
  app.route("/signup").post(addNewUser);
};
export default Routes;
