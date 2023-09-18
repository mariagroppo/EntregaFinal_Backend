const registerForm = async (req, res) => {
    try {
        res.sendSuccessMessage("For the registration process you need to send the folloging information: first_name, last_name, userEmail, inputPassword.");
    } catch (error) {
        res.sendErrorMessage("registerForm controller error: " + error)
    } 
};

const register = async (req, res) => {
    try {
        if (req.user) {
            res.sendSuccessMessage("User registered successfully!")
        } else {
            res.sendErrorMessage("Registration process error.")
        }
    } catch (error) {
        res.sendErrorMessage("register controller error: " + error)
    }
}

const registerFail = async (req, res) => {
    res.sendErrorMessage("Error during registration process. Please try again.")
}

export default {
    registerForm,
    register,
    registerFail
}