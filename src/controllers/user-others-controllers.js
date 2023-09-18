import { userService } from "../services/repository.js";
import { createHash, validatePassword } from "../../utils.js";
import crypto from 'crypto';
import { mailPwd } from "../mail/nodemailer.js";

const logout = async (req, res) => {
    try {
        if (req.session) {
            const email = req.session.user.email;
            req.session.destroy();
            await userService.lastConnection(email);
        }
        res.sendSuccessMessage("Logout process ok.")
    } catch (error) {
        res.sendErrorMessage("logout controller error: " + error)
    }
    
}

const current = async(req,res) =>{
    try {
        res.sendSuccessMessage(req.session.user)
    } catch (error) {
        res.sendErrorMessage("Current error: " + error)
    }
}


const changePwdForm = async (req, res) => {
    try {
        res.sendSuccessMessage("Please write your actualPassword and your newPassword.")
    } catch (error) {
        res.sendErrorMessage( "changePwdForm controller error: " + error)
    }
}

const changePwd = async (req, res) => {
    let userEmail = req.session.user.email;
    const user = (await userService.getUserByEmail(userEmail)).value;
    try {
        let { actualPassword, newPassword } = req.body;
        //1° Verifico que la pwd actual este bien ingresada.
            const isSamePassword = await validatePassword(actualPassword, user.hashedPassword);
            if(isSamePassword) {
                //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
                const isSamePassword2 = await validatePassword(newPassword, user.hashedPassword);
                if(isSamePassword2) {
                    res.sendErrorMessage("Cannot replace password. Please define a different one.")
                } else {
                    const newHashedPassword = await createHash(newPassword);
                    let answer = await userService.updateUserPassword(userEmail, newHashedPassword);
                    res.sendStatusAndMessage(answer.status, answer.message)
                }
            } else {
                res.sendErrorMessage("The actual password is not correct.")
            }
    } catch (error) {
        res.sendErrorMessage("changePwd controller error: " + error)
    }
}

const restorePwdForm = async (req, res) => {
    try {
        res.sendSuccessMessage('Please complete your email.')
    } catch (error) {
        res.sendErrorMessage("restorePwdForm controller error: " + error)
    }
}

/* const restorePassword = async (req, res, next) => {
    try {
        let { userEmail } = req.body;
        if(!userEmail) {
            req.info = {
                status: 'error',
                message: "Please insert a valid email."
            };
            next();
        }
        const user = await userService.getUserByEmail(userEmail);
        let userId = user._id;
        if(!user) {
            req.info = {
                status: 'error',
                message: "The email charged is not registered in this ecommerce."
            };
            next();
        } else {
            const token = crypto.randomBytes(32).toString('hex');
            //const resetTokens[userId] = token;
            await mailPwd(userEmail, token);
            req.info = {
                status: 'success',
                message: "The email to change password was sent."
            };
            next();
            res.sendSuccessMessage('Please complete your email.')

        }
        
    } catch (error) {
        req.info = {
            status: 'error',
            message: "restorePassword controller error: " + error
        };
        next();
    }
} */

export default {
    logout,
    current,
    changePwdForm,
    changePwd,
    restorePwdForm,
    //restorePassword
}