import productControllers from '../controllers/product-controllers.js';
import generalControllers from '../controllers/general.js';
import BaseRouter from './router.js';
import { privacy } from '../auth/auth.js';

export default class ProductsRouter extends BaseRouter {
    init() {
        this.get('/', ['USER'], privacy('PRIVATE'), productControllers.getProducts);
        this.get('/mine', ['PREMIUM'], privacy('PRIVATE'), productControllers.getProducts);
        this.get('/add', ['PREMIUM'], privacy('PRIVATE'), productControllers.addProductForm);
        this.post('/add', ['PREMIUM'], privacy('PRIVATE'), productControllers.addProduct);
        this.get('/:pid', ['USER'], privacy('PRIVATE'), productControllers.getProductById);
        this.put('/update/:pid', ['PREMIUM'], privacy('PRIVATE'), productControllers.updateProductById);
        this.delete('/delete/:pid', ['PREMIUM'], privacy('PRIVATE'), productControllers.deleteProductById);
        this.get('*', ['USER'], privacy('PRIVATE'), generalControllers.pageNotFound);
    }
}