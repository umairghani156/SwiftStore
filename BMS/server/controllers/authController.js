import mongoose from "mongoose";
import { BADREQUEST, INTERNALERROR, NOTFOUND, OK } from "../constants/httpStatus.js";
import { responseMessages } from "../constants/responseMessage.js";
import { GenerateToken } from "../constants/Token.js";
import User from "../models/User.js";
import{ compareSync, genSaltSync, hashSync } from "bcrypt";
import nodemailer from "nodemailer";
import pkg from "jsonwebtoken";
import { tryCatch } from "bullmq";
const {verify} = pkg;

export const signupController = async (req, res) => {
    const { username, email, password, role, contactNumber, office, image} = req.body;
    try {
        if (!username || !email || !password || !role || !contactNumber) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };

       
        if (password.length < 7) {
            return res.status(BADREQUEST).json({
                success: false,
                message: "Password should be at least 8 characters"
            })
        };




        const user = await User.findOne({ email: email });
       
        if (user) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.USER_EXISTS
            })
        } else {
            const salt = genSaltSync(10);
            const hashedPassword = hashSync(password, salt);
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                role: role,
                contactNumber,
                office,
                image: image
            });
            const savedUser = await newUser.save();

            if (savedUser.errors) {
                return res.status(BADREQUEST).json({
                    success: false,
                    message: responseMessages.INTERNAL_ERROR_MESSAGE
                })
            } else {
                const token = GenerateToken({ data: savedUser, expiresIn: '24h' });
                return res.status(200).json({
                    success: true,
                    message: responseMessages.ADD_SUCCESS_MESSAGES,
                    token,
                    data: savedUser
                })
            }
        }



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

//Login Controller

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(BADREQUEST).json({
                success: false,
                message: responseMessages.MISSING_FIELDS
            })
        };

        const user = await User.findOne({email: email});
       if(!user){
        return res.status(BADREQUEST).json({
            success: false,
            message: responseMessages.NO_USER
        })
       }else{
        const isvalid = compareSync(password, user.password);
         if(!isvalid){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Wrong Credentials"
            })
         }

              user.password = undefined;
                const token = GenerateToken({ data: user, expiresIn: '24h' });
                res.cookie("token", token, { httpOnly: true });
              return  res.status(OK).json({
                    success: true,
                    message: "Login Successful",
                    token,
                    data: user
                })
       }



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await User.aggregate([
            { 
              $project: { 
                password: 0 
              } 
            },
            {
              $lookup: {
                from: "offices",        
                localField: "office",    
                foreignField: "_id",     
                as: "officeDetails"     
              }
            },
            {
              $project: {
                username: 1,
                email: 1,
                role: 1,
                image: 1,
                contactNumber: 1,
                createdAt: 1,
                updatedAt: 1,
                office: {
                  _id: { $arrayElemAt: ["$officeDetails._id", 0] },
                  name: { $arrayElemAt: ["$officeDetails.officeName", 0] }
                }
              }
            },
            {
              $sort: {
                createdAt: -1
              }
            }
          ]);
          
        if(!users){
            return res.status(BADREQUEST).json({
                success: false,
                message: "No users found"
            });
        }
        users.map((user) => {
            user.password = undefined
        })
        return res.status(OK).json({
            success: true,
            message: "All Users",
            data: users
        })
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


// Update a User

export const updateUserController = async (req, res) => {
    const { id } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id) || !id){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Invalid user id or not found"
            });
        };

        const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if(!updateUser){
            return res.status(BADREQUEST).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(OK).json({
            success: true,
            message: "User updated successfully",
            data: updateUser
        })
        
    } catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};

// Delete a User
export const deleteUserController = async (req, res)=>{
    const {id} = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(id) || !id){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Id is invalid or required"
            })
        };

        const deleteUser = await User.findByIdAndDelete(id);
        if(!deleteUser){
            return res.status(BADREQUEST).json({
                success: false,
                message: "User not found"
            })
        };

        return res.status(OK).json({
            success: true,
            message: "User deleted successfully",
            data: deleteUser
        });
        
    }catch (error) {
        return res.status(INTERNALERROR).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
};


export const getAllTenantsController = async (req, res) => {
    
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    try {
        // Aggregation pipeline for tenants
        const tenants = await User.aggregate([
            {
                $match: {
                    role: "Tenant"
                }
            },
            { 
                $project: { 
                    password: 0 // Exclude password field
                }
            },
            {
                $lookup: {
                    from: "offices",         
                    localField: "office",     
                    foreignField: "_id",      
                    as: "officeDetails"       
                }
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    role: 1,
                    image: 1,
                    contactNumber: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    office: {
                        _id: { $arrayElemAt: ["$officeDetails._id", 0] },
                        name: { $arrayElemAt: ["$officeDetails.officeName", 0] }
                    }
                }
            },
            { $skip: skip },
            { $limit: parseInt(limit) },
            { $sort: { createdAt: -1 } }

        ]);

        const totalTenants = await User.countDocuments();

        if (!tenants || tenants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No tenants found"
            });
        }

      
        return res.status(200).json({
            success: true,
            message: "All Tenants",
            data: tenants,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalTenants / limit),
                totalTenants
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Forget Password
export const forgetPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (email) {
            const user = await User.findOne({ email: email });
            if (user) {
                const secret = user._id + process.env.jwt_secret_key;
                const token = GenerateToken({ data: secret, expiresIn: '1h' });
                const link = `${process.env.web_link}/reset-password/${user._id}/${token}`;
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.PORTAL_EMAIL,
                        pass: process.env.PORTAL_PASSWORD,
                    },
                });

                const mailOptions = {
                    from: process.env.PORTAL_EMAIL,
                    to: email,
                    subject: 'Reset Password',
                    text: `Please click on the link to reset your password ${link}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res
                            .status(INTERNALERROR)
                            .send(sendError({ status: false, message: error.message }));
                    } else {
                        return res.status(OK).send(
                            {
                                status: true,
                                message: 'Reset Password Link Generated',
                            }
                           )
                        
                    }
                });

            } else {
                return res
                    .status(NOTFOUND)
                    .send({ status: false, message: responseMessages.NO_USER_FOUND });
            }
        } else {
            return res
                .status(BADREQUEST)
                .json({
                    success: false,
                    message: 'Email is required',
                });
        }

    } catch (error) {
        res.status(INTERNALERROR).send({
            status: false,
            message: error.message,
            data: null
        })
    }
};

export const getResetPassword = async (req, res)=>{
    const {id, token} = req.params;
    try{
        const user = await User.findById(id);
        if(!user){
            return res.status(NOTFOUND).json({
                success: false,
                message: "User not found"
            });
        }
        try {
            const verifyUser = verify(token, process.env.jwt_secret_key); 
            const frontendResetPasswordUrl = `${process.env.FRONTEND_URL}/reset_password/${id}/${token}`;
            return res.status(OK).send(`
            <html>
            <head>
                <style>
                   *{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                   }
                    .passwordPar{
                        width: 100%;
                        height:100%;
                        display: flex;
                        justify-content:center;
                        align-items:center;
                    }
                    .passwordWrapper{
                        max-width:90vw;
                        width:400px;
                        height: 150px;
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        gap:30px;
                        padding:15px 10px;
                        border-radius:10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .button {
                        background-color: rgb(104, 81, 255);
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 10px;
                    }
                    #change{
                        text-align:center;
                    }

                    .button:hover {
                        background-color: blue;
                    }
                    #header{
                        font-size: 25px;
                        font-weight: 500;
                        font-family: sans-serf;
                    }
                </style>
            </head>
            <body>
                <div class="passwordPar">
                 <div class="passwordWrapper">
                 <div>
                <p id="header">Verified successfully!</p>
                <p id="change">Now, Change your password</p>
                </div>
                <button class="button" onclick="redirectToResetPassword()">Reset Password</button>
                </div>
                </div>
                <script>
                    function redirectToResetPassword() {
                        window.location.href = '${frontendResetPasswordUrl}';
                    }
                </script>
            </body>
        </html>
            `);
        } catch (err) {
            return res.status(BADREQUEST).send(`
            <html>
            <head>
                <style>
                   *{
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                   }
                    .passwordPar{
                        width: 100%;
                        height:100%;
                        display: flex;
                        justify-content:center;
                        align-items:center;
                    }
                    .passwordWrapper{
                        max-width:90vw;
                        width:400px;
                        background-color:red;
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        gap:30px;
                        padding:15px 10px;
                        border-radius:10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .button {
                        background-color: rgb(104, 81, 255);
                        border: none;
                        color: white;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 10px;
                    }
                    #change{
                        text-align:center;
                    }

                    .button:hover {
                        background-color: blue;
                    }
                    #header{
                        font-size: 25px;
                        font-weight: 500;
                        font-family: sans-serf;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="passwordPar">
                 <div class="passwordWrapper">
                 <div>
                <p id="header">You are not Verified!</p>
                </div>
                </div>
                </div>
                
            </body>
        </html>`);
        }

    }catch(error){
        res.status(BADREQUEST).send({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE,
        })
    }
};


export const resetPasswordController = async (req, res) =>{
    const {id, token} = req.params;
    const {password} = req.body;
    try {
        if(!mongoose.Types.ObjectId.isValid(id) || !id){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Id is invalid or required"
            })
        }
        if(!token){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Token is required"
            })
        };
        if(!password){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Password is required" 
            })
        };

        const verifyToken = verify(token, process.env.JWT_SECRET_KEY);
        if(!verifyToken){
            return res.status(BADREQUEST).json({
                success: false,
                message: "Token is invalid or expired"
            })
        };
        const user = await User.findById(id);
        if(!user){
            return res.status(BADREQUEST).json({
                success: false,
                message: "User not found"
            })
        };
        const salt = genSaltSync(10);
        const hashedPassword = hashSync(password, salt);
        await User.findByIdAndUpdate(user._id, {
            $set: { password: hashedPassword },
        });
        return res.status(OK).json({
            success: true,
            message: "Password reset successfully"
        })
           
        
    } catch (error) {
        return res.status(BADREQUEST).json({
            success: false,
            message: responseMessages.INTERNAL_ERROR_MESSAGE
        })
    }
}