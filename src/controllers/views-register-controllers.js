const registerForm = async (req, res) => {
    try {
        res.render('../src/views/partials/session-register.hbs', { userStatus: false})
    } catch (error) {
        res.renderInternalError('registerForm controller error.', false)
    } 
}

const register = async (req, res) => {
    try {
        res.redirect('/login')
    } catch (error) {
        res.renderInternalError('register controller error.', false)
    }
}

const registerFailed = async (req, res) => {
    res.renderInternalError("Registration process error. Please try again.", false)
}

export default {
    registerForm,
    register,
    registerFailed
}