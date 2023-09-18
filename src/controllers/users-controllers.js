import { userService } from "../services/repository.js";
import { mailPremiumChange, mailPremiumChangeSuccessfully } from "../mail/nodemailer.js";

const listAllUsers = async (req, res) => {
    try {
        const users = await userService.listUsers();
        const filteredArray = users.map((user) => ({
            name: user.first_name,
            email: user.userEmail,
            role: user.role,
          }));
        res.sendSuccessMessageAndValue("Users list OK", filteredArray);
    } catch (error) {
        res.sendErrorMessage("listAllUsers controller error: " + error)
    }
}

const usersLastConnection = async (req, res) => {
    try {
        const users = await userService.usersLastConnection();
        res.sendSuccessMessageAndValue(users.message, users.payload);
    } catch (error) {
        res.sendErrorMessage("deleteUsersLastConnection controller error: " + error)
    }
}

const deleteUsersLastConnection = async (req, res) => {
    try {
        const users = await userService.deleteUsersLastConnection();
        res.sendSuccessMessageAndValue(users.message, users.payload);
    } catch (error) {
        res.sendErrorMessage("deleteUsersLastConnection controller error: " + error)
    }
}



/* const updateUserRole = async (req, res, next) => {
    try {
        const {userEmail, role} = req.body;
        let id = req.params.pid;
        const newProd = {
            id: parseInt(id),
            title: title,
            description: description,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
            category: category
        }
        if (isNaN(id)){
            req.info = {
                status: 'error',
                message: "The ID must be a number.",
            };
            next();       
        } else {
            const answer = await productService.updateById(newProd,userId);
            req.info = {
                status: answer.status,
                message: answer.message
            };
            next(); 
        }
    } catch (error) {
        req.info = {
            status: 'error',
            message: "updateProductById Controller error: " + error,
        };
        next();        
    }
} */

/* const uploadPremiumAvatar = async (req, res, next) => {
    try {
        console.log("esto?")
        console.log(req.file);

    } catch (error) {
        
    }
} */


const uploadPremiumDoc = async (req, res) => {
    try {
        const filesUploaded = req.files;
        /* filesUploaded.forEach(element => {
            console.log("ELEMENTO -------------------------------------------------------")
            console.log(element);
        }); */
        //Verifico el estado del usuario. Si es premium, no hace fala seguir el proceso.
        if ((req.session.user.role ==='premiumUser') || (req.session.user.role === 'admin')) {
            res.sendSuccessMessage("You are a PREMIUM user, so you don´t need to update your documents.")
        } {
            //1. Cambiar el estado del tramite del usuario :uid a Pending.
            const answer = await userService.updateProcedureStatus(req.session.user.email);
            if (answer.status === 'success') {
                //2. Notificar al ADMIN por correo del pedido con los archivos adjuntos.
                await mailPremiumChange(req.session.user);
                res.sendSuccessMessage("The admin will analyze your documentation to move to premium category.")

            } else {
                res.sendErrorMessage("An error occurs. Please try again.")
            } 
        }
    } catch (error) {
        res.sendErrorMessage("uploadPremiumDoc controller error: " + error)
    }
}

const changeUserToPremium = async (req, res) => {
    try {
        const uid = req.params.uid;
        const answer = await userService.getUserByID(uid);
        if (answer.status === 'success') {
            const answer2 = await userService.updateStatus(uid);
            if (answer2.status === 'success') {
                await mailPremiumChangeSuccessfully(answer.value)
                res.sendSuccessMessage(answer2.message)
            } else {
                res.sendErrorMessage(answer2.message)
            }    
        } else {
            res.sendErrorMessage(answer.message)
        } 
    } catch (error) {
        res.sendErrorMessage("changeUserToPremium controller error: " + error)
    }
}

const updateDNIStatus = async (req, res) => {
    try {
        const uid = req.params.uid;
        const answer = await userService.updateDNIStatus(uid);
        if (answer.status === 'success') {
            res.sendSuccessMessage(answer.message)
        } else {
            res.sendErrorMessage(answer.message)
        } 
    } catch (error) {
        res.sendErrorMessage("updateDNIStatus controller error: " + error)
    }
}

const updateComp1Status = async (req, res) => {
    try {
        const uid = req.params.uid;
        const answer = await userService.updateComp1Status(uid);
        if (answer.status === 'success') {
            res.sendSuccessMessage(answer.message)
        } else {
            res.sendErrorMessage(answer.message)
        } 
    } catch (error) {
        res.sendErrorMessage("updateComp1Status controller error: " + error)
    }
}

const updateComp2Status = async (req, res) => {
    try {
        const uid = req.params.uid;
        const answer = await userService.updateComp2Status(uid);
        if (answer.status === 'success') {
            res.sendSuccessMessage(answer.message)
        } else {
            res.sendErrorMessage(answer.message)
        } 
    } catch (error) {
        res.sendErrorMessage("updateComp2Status controller error: " + error)
    }
}

export default {
    listAllUsers,
    usersLastConnection,
    deleteUsersLastConnection,
    uploadPremiumDoc,
    //uploadPremiumAvatar,
    changeUserToPremium,
    updateDNIStatus,
    updateComp1Status,
    updateComp2Status
}