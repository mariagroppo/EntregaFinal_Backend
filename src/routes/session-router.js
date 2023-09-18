import userRegisterControllers from '../controllers/user-register-controller.js';
import userLoginControllers from '../controllers/user-login-controllers.js';
import otherSessionControllers from '../controllers/user-others-controllers.js';
import generalControllers from '../controllers/general.js';
import passport from "passport";
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class SessionRouter extends BaseRouter {
    init() {
        /* REGISTER ------------------------------------------------------------------------------------ */
        this.get('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerForm);
        this.post('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('register', {failureRedirect:'/api/sessions/register/registerFail'}), userRegisterControllers.register);
        this.get('/register/registerFail', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userRegisterControllers.registerFail);
        
        /* LOGIN ----------------------------------------------------------------------------------------- */
        this.get('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginForm);
        this.post('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('login', {failureRedirect:'/api/sessions/login/loginFail'}), userLoginControllers.login);
        this.get('/login/loginFail', ['PUBLIC'], privacy('NO_AUTHENTICATED'), userLoginControllers.loginFail);
        
        /* OTHERS ------------------------------------------------------------------------------------------ */
        this.get('/logout', ['USER'], privacy('PRIVATE'), otherSessionControllers.logout);
        this.get('/current', ['USER'], privacy('PRIVATE'), otherSessionControllers.current)
        this.get('/current/changePwd', ['USER'], privacy('PRIVATE'), otherSessionControllers.changePwdForm)
        this.post('/current/changePwd', ['USER'], privacy('PRIVATE'), otherSessionControllers.changePwd)
        //this.get('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), otherSessionControllers.restorePwdForm)
        
        //this.post('/restore', ['PUBLIC'], privacy('NO_AUTHENTICATED'), otherSessionControllers.restorePassword);
        this.get('*', ['PUBLIC'], privacy('NO_AUTHENTICATED'), generalControllers.pageNotFound)
    }
}