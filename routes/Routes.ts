
import {Request, Response} from "express";
import { addNewUser, getAllUser,login } from "../controller/controller";


const Routes = (app:any) => {
    app.route('/')
        .get((request: Request, response: Response) => {
            response.status(200)
                .send({
                    message: "GET request successfully."
                });
        });
    app.route('/user')
        .get(getAllUser)
    app.route('/login')
        .post(login);
    app.route('/signup')
        .post(addNewUser);

}
export default Routes;