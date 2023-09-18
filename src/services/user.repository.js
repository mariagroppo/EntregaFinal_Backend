//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    verifyMail = async (email) =>{
        return this.dao.verifyMail(email);
    }

    checkPassword = async (email, password) =>{
        return this.dao.checkPassword(email, password);
    }
    createUser = async (user) =>{
        return this.dao.createUser(user);
    }

    getUserByEmail = async (email) =>{
        return this.dao.getUserByEmail(email);
    }

    updateUserPassword = async (email, newPass) =>{
        return this.dao.updateUserPassword(email, newPass);
    }

    lastConnection = async(email) => {
        return await this.dao.lastConnection(email);
    }

    listUsers = async () => {
        return this.dao.listUsers();
    }

    usersLastConnection = async () =>{
        return this.dao.usersLastConnection();
    }

    deleteUsersLastConnection = async () =>{
        return this.dao.deleteUsersLastConnection();
    }

    updateProcedureStatus = async (uid) =>{
        return this.dao.updateProcedureStatus(uid);
    }

    updateStatus = async (uid) =>{
        return this.dao.updateStatus(uid);
    }

    updateDNIStatus = async (uid) =>{
        return this.dao.updateDNIStatus(uid);
    }

    updateComp1Status = async (uid) =>{
        return this.dao.updateComp1Status(uid);
    }

    updateComp2Status = async (uid) =>{
        return this.dao.updateComp2Status(uid);
    }

    getUserByID = async (uid) =>{
        return this.dao.getUserByID(uid);
    }

    backToUser = async (uid) =>{
        return this.dao.backToUser(uid);
    }

    deleteUser = async (uid) =>{
        return this.dao.deleteUser(uid);
    }
}