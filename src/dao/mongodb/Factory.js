import config from '../../config/config.js';
import { connection } from './config.js';
const persistence = config.app.PERSISTENCE;
// Esta “Fábrica” se encargará de devolver sólo el DAO que necesitemos acorde 
// con lo solicitado en el entorno o los argumentos. 

export default class PersistenceFactory {
    static async getPersistence() {
        let usersDAO;
        let productsDAO;
        let cartsDAO;
        let ticketsDAO;
        switch (persistence) {
            case 'MONGO':
                connection();
                const {default: UserManager} = await import ('../mongodb/managers/userManager.js');
                usersDAO = new UserManager;
                const {default: ProductManager} = await import ('../mongodb/managers/prodsMongoDB.js')
                productsDAO = new ProductManager;
                const {default: CartManager} = await import ('../mongodb/managers/cartsMongoDB.js');
                cartsDAO = new CartManager;
                const {default: TicketsManager} = await import ('../mongodb/managers/ticketsMger.js')
                ticketsDAO = new TicketsManager
            case 'FS':
                break
            }
        return {usersDAO, productsDAO, cartsDAO, ticketsDAO };
        }
}