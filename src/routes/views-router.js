
import passport from 'passport';
import { privacy } from '../auth/auth.js';
import views_register_controllers from '../controllers/views-register-controllers.js';
import views_login_controllers from '../controllers/views-login-controllers..js';
import viewsOtherSessionControllers from '../controllers/views-otherSession-controllers.js';
import viewsUsersControllers from '../controllers/views-users-controllers.js'
import viewsProductsControllers from '../controllers/views-products-controllers.js';
import viewsCartsControllers from '../controllers/views-carts-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import uploader from '../services/uploader.js';

export default class ViewsRouter extends BaseRouter {
    init() {
        this.get('/register', ['PUBLIC'], privacy('NO_AUTHENTICATED'), views_register_controllers.registerForm);
        this.post('/register', ['PUBLIC'], passport.authenticate('register', {failureRedirect:'/registerFail'}), views_register_controllers.register);
        this.get('/registerFail', ['PUBLIC'], views_register_controllers.registerFailed);
        
        this.get('/login', ['PUBLIC'], privacy('NO_AUTHENTICATED'), views_login_controllers.loginForm);
        this.post('/login', ['PUBLIC'], passport.authenticate('login', {failureRedirect: '/loginFailed',failureMessage: true}), views_login_controllers.login);
        this.get('/loginFailed', ['PUBLIC'], views_login_controllers.loginFailed);
        this.get('/login/github', ['PUBLIC'], privacy('NO_AUTHENTICATED'), passport.authenticate('github'),(req,res)=>{});
        this.get('/login/githubcallback', ['PUBLIC'], passport.authenticate('github'), views_login_controllers.githubCallback)
        
        this.get('/logout', ['USER'], privacy('PRIVATE'), viewsOtherSessionControllers.logout);
        this.get('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsOtherSessionControllers.restorePasswordForm);
        this.post('/restorePassword', ['PUBLIC'], privacy('NO_AUTHENTICATED'), viewsOtherSessionControllers.restorePassword);
        
        this.get('/current', ['USER'], privacy('PRIVATE'), viewsOtherSessionControllers.current);
        this.get('/current/changePwd', ['USER'], privacy('PRIVATE'), viewsOtherSessionControllers.changePwdForm)
        this.post('/current/changePwd', ['USER'], privacy('PRIVATE'), viewsOtherSessionControllers.changePwd)
        this.post('/current/uploadImage', ['USER'], privacy('PRIVATE'), uploader.any(), viewsOtherSessionControllers.uploadProfileImage);

        /* PRODUCTOS  ------------------------------------------------------------ */
        this.get('/products', ['USER'], privacy('PRIVATE'), viewsProductsControllers.viewProducts);
        this.get('/products/mine',['PREMIUM'], privacy('PRIVATE'), viewsProductsControllers.viewProducts);
        this.get('/products/mine/add', ['PREMIUM'], privacy('PRIVATE'), viewsProductsControllers.addProductForm);
        this.post('/products/mine/add',  ['PREMIUM'], privacy('PRIVATE'),  viewsProductsControllers.addProduct);
        this.get('/products/:pid',  ['USER'], privacy('PRIVATE'), viewsProductsControllers.productById)
        this.get('/products/mine/update/:pid', ['PREMIUM'], privacy('PRIVATE'), viewsProductsControllers.updateProductByIdForm)
        this.post('/products/mine/update/:pid', ['PREMIUM'], privacy('PRIVATE'), viewsProductsControllers.updateProductById)
        this.post('/products/mine/delete/:pid', ['PREMIUM'], privacy('PRIVATE'), viewsProductsControllers.deleteProductById)
        this.get('/faker', ['USER'], privacy('PRIVATE'), viewsProductsControllers.faker);
        
        //this.get('/realtimeproducts', ['USER'], privacy('PRIVATE'), getProducts)
        //this.get('/chat', ['USER'], privacy('PRIVATE'), getChat)
        
        /* USERS ------------------------------------------------------------------ */
        this.get('/users', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.listAllUsers)
        this.get('/users/lastConnection', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.usersLastConnection)
        this.post('/users/delete', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.deleteUsersLastConnection)
        
        this.get('/users/documents', ['USER'], privacy('PRIVATE'), viewsUsersControllers.uploadPremiumDocForm);
        this.post('/users/documents', ['USER'], privacy('PRIVATE'), uploader.any(), viewsUsersControllers.uploadPremiumDoc);
        this.post('/premium/:uid', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.changeUserToPremium);
        this.post('/backToUser/:uid', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.backToUser);
        this.post('/delete/:uid', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.deleteUser);
        
        this.post('/premium/DNI/:uid', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.updateDNIStatus);
        this.post('/premium/comp1/:uid', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.updateComp1Status);
        this.post('/premium/comp2/:uid', ['ADMIN'], privacy('PRIVATE'), viewsUsersControllers.updateComp2Status);

        /* CARTS ------------------------------------------------------------------ */
        this.get('/carts', ['USER'], privacy('PRIVATE'), viewsCartsControllers.viewCarts);
        this.get('/carts/add', ['USER'], privacy('PRIVATE'), viewsCartsControllers.addNewCart);
        this.get('/carts/:cid', ['USER'], privacy('PRIVATE'),  viewsCartsControllers.cartById);
        this.post('/carts/delete/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.deleteCartById);
        this.post('/carts/product/:pid',  ['USER'], privacy('PRIVATE'), viewsCartsControllers.addProductInCart);
        this.post('/carts/delete/:cid/product/:pid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.deleteProduct)
        
        this.post('/carts/update/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.updateCart);
        this.post('/closeCart/:cid', ['USER'], privacy('PRIVATE'), viewsCartsControllers.closeCart)
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.views_pageNotFound)
        
    }
}

