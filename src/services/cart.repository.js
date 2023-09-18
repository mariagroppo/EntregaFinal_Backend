//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = async (userId) => {
        return this.dao.getAll(userId);
    }

    getById = async (number,userId) => {
        return this.dao.getById(number,userId);
    }

    asignId = async () => {
        return this.dao.asignId();
    }

    save = async (userId) => {
        return this.dao.save(userId);
    }

    deleteById = async (id, userId) => {
        return this.dao.deleteById(id, userId);
    }

    verifyProductIsCharged = async (idCart, id) => {
        return this.dao.verifyProductIsCharged(idCart, id);
    }

    addProductInCart = async (cid, id, quantity,userId) => {
        return this.dao.addProductInCart(cid, id, quantity,userId);
    }

    updateCart = async (cid, id, qty, userId) => {
        return this.dao.updateCart(cid, id, qty, userId);
    }

    deleteProduct = async (cid, id, userId) => {
        return this.dao.deleteProduct(cid, id, userId);
    }

    updateCartGlobal = async (cid, newData, userId) => {
        return this.dao.updateCartGlobal(cid, newData, userId);
    }

    updateCartGlobal2 = async (cid, newData) => {
        return this.dao.updateCartGlobal2(cid, newData);
    }

    closeCart = async (cid, userId) => {
        return this.dao.closeCart(cid,userId);
    }

    reopenCart = async (cid) => {
        return this.dao.reopenCart(cid);
    }
}