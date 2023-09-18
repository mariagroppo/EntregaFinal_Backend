import { validatePassword } from "../../../../utils.js";
import UserModel from "../models/userModel.js";
import {mailDeleteAccount} from '../../../mail/nodemailer.js'

class UserManager {
    verifyMail = async (email) => {
        try {
            let ok = await UserModel.findOne({userEmail: email}).lean();
            if (ok) {
                return true
            }
            return false
        } catch (error) {
            return true
        }
    }
  
    createUser = async (user) => {
        try {
            const verification = await this.verifyMail(user.userEmail);
            if (!verification) {
                const newUser = await UserModel.create(user);
                return { status: 'success', message: "User created ok.", value: newUser}
            }
            return { status: 'error', message: "User not created. Email already exists.", value: null}
        } catch (error) {
            return { status: 'error', message: "User not created - Error: " + error, value: null}
        }
    };

    checkPassword = async (email, password) => {
        try {
            let user = await UserModel.findOne({userEmail: email}).lean();
            if (user) {
                //console.log("El usuario existe")
                const isValidPassword = await validatePassword(password,user.hashedPassword);
                //if (password === user.inputPassword) {
                if (isValidPassword) {
                    return { status: 'success', message: "User logged in ok.", value: user}
                } else {
                    //res.status(400).send({status:'error', message: "User not logged in. Password incorrect."})
                    return { status: 'error', message: "User not logged in. Password incorrect.", value: null}
                }
            } else {
                return { status: 'error', message: "User not logged in. Email not found.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "User not logged in - Error: " + error, value: null}
        }
    };

    getUserByEmail = async (email) => {
        try {
            let user = await UserModel.findOne({userEmail: email}).lean();
            if (user) {
                return { status: 'success', message: "User founded.", value: user}
            } else {
                return { status: 'error', message: "User not founded.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "getUserByEmail Manager error: " + error, value: null}
        }
    }

    getUserByID = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                return { status: 'success', message: "User founded.", value: user}
            } else {
                return { status: 'error', message: "User not founded.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "getUserByID Manager error: " + error, value: null}
        }
    }

    updateUserPassword = async (email, newHashedPassword) => {
        try {
            const answer = await UserModel.updateOne(
                {userEmail: email},
                {
                    $set: {hashedPassword: newHashedPassword}
                })
            if (answer.acknowledged === false) {
                return { status: 'error', message: "User password NOT updated."}
            } else {
                return { status: 'success', message: "User password updated."}
            }
        } catch (error) {
            return { status: 'error', message: "updateUserPassword Manager error: " + error}
        }
    }

    listUsers= async () => {
        try {
            let users = await UserModel.find().lean();
            return users
        } catch (error) {
            return null
        }
    }

    usersLastConnection = async () => {
        try {
            const users = await this.listUsers();
            const now = new Date().getTime();
            let connectionsArray=[];
            users.forEach(element => {
                let last = element.last_connection;
                let difference = (now - last) / (1000*60*60*24);
                let result = element.first_name + " " + element.last_name + " not connected since: " + difference.toFixed(2) + " days."
                connectionsArray.push(result);
            });
            return { status: 'success', message: "User list OK.", payload: connectionsArray}
            //db.tu_coleccion.deleteOne({ campo: valor });
        } catch (error) {
            return { status: 'error', message: "usersLastConnection Manager error: " + error, payload: null}
        }
    }

    lastConnection = async (email) => {
        try {
            const last_connection = new Date().getTime();
            const answer = await UserModel.updateOne(
                {userEmail: email},
                {
                    $set: {last_connection: last_connection}
                })
            if (answer.acknowledged === false) {
                return { status: 'error', message: "User status NOT updated correctly."}
            } else {
                return { status: 'success', message: "User status updated."}
            }
        } catch (error) {
            return { status: 'error', message: "updateUserLastConnection Manager error: " + error}
        }
    }

    deleteUsersLastConnection = async () => {
        try {
            const users = await this.listUsers();
            const now = new Date().getTime();
            let deletedUsers = [];
            users.forEach(async (element) => {
                let last = element.last_connection;
                let difference = (now - last) / (1000*60*60*24);
                if (difference >= 10) {
                    //Borro usuario - Comente el codigo para que no sean borrados realmente.
                    const result = await UserModel.deleteOne({
                        _id: element._id
                    })
                    if (result.acknowledged === true) {
                        deletedUsers.push(element);
                        await mailDeleteAccount(element);
                    }
                }
            });
            if (deletedUsers.length > 0) {
                return { status: 'success', message: "User deleted OK", payload: deletedUsers}
            } else {
                return { status: 'success', message: "No users deleted.", payload: null}
            }

            //db.tu_coleccion.deleteOne({ campo: valor });
        } catch (error) {
            return { status: 'error', message: "deleteUsersLastConnection Manager error: " + error, payload: null}
        }
    }

    updateProcedureStatus = async (email) => {
        try {
            const answer = await UserModel.updateOne(
                {userEmail: email},
                {
                    $set: {procedureStatus: "Pending"}
                })
            if (answer.acknowledged === false) {
                return { status: 'error', message: "User Procedure Status NOT updated."}
            } else {
                return { status: 'success', message: "User Procedure Status updated."}
            }
        } catch (error) {
            return { status: 'error', message: "updateProcedureStatus Manager error: " + error}
        }
    }

    updateStatus = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                if ((user.DNI === 'Completed') && (user.comprobante1 === 'Completed') && (user.comprobante2 === 'Completed')) {
                    const answer = await UserModel.updateOne(
                        {_id: uid},
                        {
                            $set: {procedureStatus: "Completed"}
                        })
                    if (answer.acknowledged === false) {
                        return { status: 'error', message: "User Procedure Status and role NOT updated."}
                    } else {
                        const answer2 = await UserModel.updateOne(
                            {_id: uid},
                            {
                                $set: {role: "premiumUser"}
                            })
                        if (answer2.acknowledged === false) {
                            return { status: 'error', message: "User Procedure Status updated but role NOT updated."}
                        } else {
                            return { status: 'success', message: "User Procedure Status and role updated."}
                        }

                    }
                } else {
                    return { status: 'error', message: `Some documents are not approved.`, value: null}
                }
            } else {
                return { status: 'error', message: `User with ID ${uid} not founded.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: "updateStatus Manager error: " + error}
        }
    }

    updateDNIStatus = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                const answer = await UserModel.updateOne(
                    {_id: uid},
                    {
                        $set: {DNI: "Completed"}
                    })
                if (answer.acknowledged === false) {
                    return { status: 'error', message: "User DNI Status NOT updated."}
                } else {
                    return { status: 'success', message: "User DNI Status updated."}
                }
                
            } else {
                return { status: 'error', message: `User with ID ${uid} not founded.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: "updateDNIStatus Manager error: " + error}
        }
    }

    updateComp1Status = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                const answer = await UserModel.updateOne(
                    {_id: uid},
                    {
                        $set: {comprobante1: "Completed"}
                    })
                if (answer.acknowledged === false) {
                    return { status: 'error', message: "User Comprobante 1 Status NOT updated."}
                } else {
                    return { status: 'success', message: "User Comprobante 1  Status updated."}
                }
                
            } else {
                return { status: 'error', message: `User with ID ${uid} not founded.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: "updateComp1Status Manager error: " + error}
        }
    }

    updateComp2Status = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                const answer = await UserModel.updateOne(
                    {_id: uid},
                    {
                        $set: {comprobante2: "Completed"}
                    })
                if (answer.acknowledged === false) {
                    return { status: 'error', message: "User Comprobante 2 Status NOT updated."}
                } else {
                    return { status: 'success', message: "User Comprobante 2  Status updated."}
                }
                
            } else {
                return { status: 'error', message: `User with ID ${uid} not founded.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: "updateComp2Status Manager error: " + error}
        }
    }

    backToUser = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                const answer = await UserModel.updateOne(
                    {_id: uid},
                    {
                        $set: {procedureStatus: "Incompleted",
                                DNI: "Incompleted",
                                comprobante1: "Incompleted",
                                comprobante2: "Incompleted",
                                role: "user"
                            }
                    })
                if (answer.acknowledged === false) {
                    return { status: 'error', message: "User Status NOT updated."}
                } else {
                    return { status: 'success', message: "User Status updated."}
                }
                
            } else {
                return { status: 'error', message: `User with ID ${uid} not founded.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: "backToUser Manager error: " + error}
        }
    }

    deleteUser = async (uid) => {
        try {
            let user = await UserModel.findOne({_id: uid}).lean();
            if (user) {
                let answer = await UserModel.deleteOne({
                        _id: uid
                    })
                if (answer.acknowledged === false) {
                    return { status: 'error', message: "User NOT deleted."}
                } else {
                    return { status: 'success', message: "User deleted."}
                }
                
            } else {
                return { status: 'error', message: `User with ID ${uid} not founded.`, value: null}
            }
        } catch (error) {
            return { status: 'error', message: "deleteUser Manager error: " + error}
        }
    }


}


export default UserManager;