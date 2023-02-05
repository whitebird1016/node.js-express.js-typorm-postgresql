import {Request, Response} from 'express';
import bcrypt, { hash } from 'bcryptjs';
import AppDataSource  from "../connection/Connection";
import User from "../entity/User";
import jwt  from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

export const getAllUser = async(req: Request, res: Response) => {
    const users: User[] = await AppDataSource.manager.find(User);
    return res.json(users);
}

export const login = async(req: Request, res: Response) => {
    // const users: User[] = await AppDataSource.manager.find(User);
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({
    email: email});
    if (!user) {
      return res.status(400).json({
        message: 'User is not found',
      });
    }
    else{
        if(user?.password){
             bcrypt.compare(password, user?.password, async(err, response) => {
            if(response === true) {
                  const payload = {
                    id: user.id,
                    };
                const token =  await jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
                  return res.status(200).json({
                    token,
                    user: {
                       user
                    },
                  });
            }
            else{
                 return res.status(400).json({
                    message:"Password is incorrect"                   
                  });
            }
              
        });
     }
       else{
                 return res.status(400).json({
                    message:"Password is incorrect"                   
                  });
            }
    }
}


export const addNewUser = async(req: Request, res: Response ) => {
    const { firstname,lastname,email,address1,address2,city,state,phone,password } = req.body;
 
    const userRepository = AppDataSource.getRepository(User);

    const checkuser = await userRepository.findOneBy({
    email: email});

    if(checkuser){  
        return res.status(400).json({
               message:"User Duplicate"                   
               });
        } else {
            let user = new User();
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.address1 = address1;
            user.address2 = address2 || "";
            user.city = city;
            user.state =state;
            user.phone = phone;
            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(password, salt, async(err, hash)=> {
                user.password = hash; // Or however suits your setup
                    await AppDataSource.manager.save(user);
                    const payload = {
                    id: user.id,
                    };
                    const token =  await jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
                    return res.status(200).json({
                        token,
                        user: {
                        user
                        },
                    });
                    });
            });
        }
   
}