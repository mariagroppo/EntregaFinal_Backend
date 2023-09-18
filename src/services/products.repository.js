//Se deben homologar los manager de FS para que los metodos se llamen de igual Forma
export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getAll = async (validLimit,page,sort,category,owner,enabled,edition) => {
        return this.dao.getAll(validLimit,page,sort,category,owner,enabled,edition);
    }

    getById = async (number) => {
        return this.dao.getById(number);
    }

    asignId = async () => {
        return this.dao.asignId();
    }

    repeatCode = async (code) => {
        return this.dao.repeatCode(code);
    }

    save = async (newProduct) => {
        return this.dao.save(newProduct);
    }

    deleteById = async (id,owner) => {
        return this.dao.deleteById(id,owner);
    }

    updateById = async (prod,owner) => {
        return this.dao.updateById(prod,owner);
    }

    validateFields =  async (product) => {
        return this.dao.validateFields(product);
    }
    
    fakerProducts = async(limit, page, sort) => {
        return this.dao.fakerProducts(limit, page, sort);
    }
}