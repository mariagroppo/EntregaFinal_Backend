import { fileExists, createHash, validatePassword } from "../../utils.js";
import config from "../config/config.js";
import { userService } from "../services/repository.js";

const logout = async (req, res) => {
    try {
        let userStatus=false;
        if (req.session) {
            req.session.destroy();
        }
        res.render('../src/views/main.hbs', {userStatus});
    } catch (error) {
        res.RenderInternalError("Logout controller error.", true)
    }
}

const restorePasswordForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-restorePwd.hbs')
    } catch (error) {
        res.RenderInternalError("restorePasswordForm controller error", true)
    }
}

const restorePassword = async (req, res) => {
    try {
        let { userEmail, newPassword } = req.body;
        //1° Verifico si el correo esta registrado.
        const user = (await userService.getUserByEmail(userEmail)).value;
        if (!user) {
            res.RenderInternalError("Email not registered.", false);
        } else {
            //2° Verifico que no esté cambiando por una contraseña igual a la almacenada.
            const isSamePassword = await validatePassword(newPassword, user.hashedPassword);
            if(isSamePassword) {
                res.RenderInternalError( "Cannot replace password. Please define a different one.", false)
            } else {
                const newHashedPassword = await createHash(newPassword);
                let a = await userService.updateUserPassword(userEmail, newHashedPassword);
                res.render('../src/views/partials/error.hbs', { message: a.message})
            }

        }
    } catch (error) {
        res.RenderInternalError("restorePassword controller error", false)
        //res.render('../src/views/partials/error.hbs', { message: "restorePassword controller error: " + error })
    }
}

const current = async (req,res) =>{
    let userName = req.session.user.name;
    let userRole = req.session.user.role;
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    };
    let enabled = false;
    let user;
    if (userName === 'admin') {
        enabled = true;
        user = {
            id: config.mailing.ADMIN_ID,
            first_name: 'admin',
            last_name: 'admin',
            role: 'admin'
        }
    } else {
        user = await userService.getUserByID(req.session.user.id);
    }
    
    //console.log(user)
    try {
        let change = false;
        if (userRole === 'user') {
            change = true
        }
        res.render('../src/views/partials/user-profile.hbs', { user: user.value, userName, userStatus: true, change, enabled, email})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "current controller error: " + error, userStatus: true, userName, enabled, myProducts, email})
    }
}

const uploadProfileImage = async (req,res) =>{
    let userName = req.session.user.name;
    let userRole = req.session.user.role;
    let email = req.session.user.email;
    let fileOK = await fileExists(email);
    if (fileOK === false) {
        email = 'perfil'
    }
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    };
    let enabled = false;
    let user;
    if (userName === 'admin') {
        enabled = true;
        user = {
            id: config.mailing.ADMIN_ID,
            first_name: 'admin',
            last_name: 'admin',
            role: 'admin'
        }
    } else {
        user = await userService.getUserByID(req.session.user.id);
    }
    try {
        res.redirect('/current');   
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "uploadProfileImage controller error: " + error, userStatus: true, userName, enabled, myProducts, email})
    }


}

export default {
    logout,
    restorePasswordForm,
    restorePassword,
    current,
    uploadProfileImage
}