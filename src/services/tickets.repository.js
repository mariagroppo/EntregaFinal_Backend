//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class TicketRepostory {
    constructor(dao) {
        this.dao = dao;
    }

    save = async (cart, user) => {
        return this.dao.save(cart, user);
    }
}