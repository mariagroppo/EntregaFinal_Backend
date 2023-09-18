import cartsControllers from '../controllers/carts-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class CartsRouter extends BaseRouter {
    init() {
        this.get('/', ['USER'], privacy('PRIVATE'), cartsControllers.getCarts);
        this.post('/', ['USER'], privacy('PRIVATE'), cartsControllers.addNewCart);
        this.get('/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.getCartById)
        this.delete('/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.deleteCartById)
        this.post('/:cid/product/:pid', ['USER'], privacy('PRIVATE'), cartsControllers.addProductInCart);
        this.delete('/:cid/product/:pid', ['USER'], privacy('PRIVATE'), cartsControllers.deleteProduct)
        
        //ERROR this.delete('/:cid/product/:id', ['PUBLIC'], cartsControllers.deleteProduct, backAnswers.getAnswers)
         //ERROR   this.put('/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.updateCart, backAnswers.getAnswers)
        
        this.post('/closeCart/:cid', ['USER'], privacy('PRIVATE'), cartsControllers.closeCart)
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound)
    }
}