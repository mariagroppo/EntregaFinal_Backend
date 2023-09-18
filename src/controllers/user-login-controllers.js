export const loginForm = async (req, res) => {
    try {
        res.sendSuccessMessage("For the login process you need to send the folloging information: userEmail, inputPassword.");
    } catch (error) {
        res.sendErrorMessage("loginForm controller error: " + error)
    }
}

export const login = async (req, res) => {
    try {
        req.session.user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
        //console.log(req.user)
        res.sendSuccessMessage("You login successfully!!!");

    } catch (error) {
        res.sendErrorMessage("Login error: " + error)
    }
}

export const loginFail = async (req, res) => {
    //Si quiero bloquear la cantidad de intentos pongo un filtro por la longitud del array que me vuelve
    // en req.sesson.messages
    //let c = req.session.messages.length;
    res.sendErrorMessage(req.session.message)
}

export default {
    loginForm,
    login,
    loginFail
}