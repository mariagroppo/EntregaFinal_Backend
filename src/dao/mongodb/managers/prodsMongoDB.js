import Product from "../models/productModel.js";
import { generateProduct } from "../../../mocks/prods.mocks.js";
import config from "../../../config/config.js";

class ProductMongoDB {
    /* Devuelve el array con los objetos presentes en el archivo ---------------------------------------- */
    getAll = async (validLimit,page,sort,category,owner,enabled,edition) => {
            try {
            let options = {
                page: Number(page) || 1,
                limit: Number(validLimit),
                sort: {price: Number(sort)},
            };
            let contenido;
            if (enabled) {
                if (category) {
                    contenido = await Product.paginate({category: category},options);
                } else {
                    contenido = await Product.paginate({},options);
                }
            } else {
                //edition=true significa que estoy en mis productos
                if (edition) {
                    if (category) {
                        contenido = await Product.paginate({category: category, owner: owner},options);
                    } else {
                        contenido = await Product.paginate({owner: owner},options);
                    }
                } else {
                    if (category) {
                        contenido = await Product.paginate({category: category,  owner: { $ne: owner }},options);
                    
                    } else {
                        contenido = await Product.paginate({ owner: { $ne: owner }},options);
                    }
                }

            }
            return { status: 'success', message: "Products ok.", value: contenido}
            
        } catch (error) {
            return { status: 'error', message: "Error en getAll MongoDB: " + error, value: null}
        }
    } 

    getById = async (number) => {
        try {
            if (parseInt(number) > 0) {
                let product = await Product.findOne({id: number}).lean();
                if (!product) {
                    return { status: 'error', message: `Product ID ${number} do not exists.`, value: null}
                } else {
                    return { status: 'success', message: "Product founded.", value: product}
                }
            } else {
                return { status: 'error', message: "Product ID is not valid.", value: null}
            }
        } catch (error) {
            return { status: 'error', message: "Error en getById MongoDB: " + error, value: null}
        }
        
    } 

    asignId = async () => {
        try {
            const list = await Product.aggregate([
                {$sort: {price:1}}
            ])
            let maxId=0;
            if (list.length === 0) {
                maxId=1;
            } else {
                list.forEach(value => {
                    if (value.id > maxId) {
                        maxId=value.id
                    }
                })
                maxId=maxId+1;
            }
            return { status: 'success', message: `Assigned product ID ${maxId} added.`, value: maxId}
        } catch (error) {
            return { status: 'error', message: `ProductManager asignId error: ${error}.`, value: null}    
        }
    }

    repeatCode = async (code) => {
        try {
            const list = await Product.aggregate([
                {$sort: {price:1}}
            ])
            for (let i=0; i<list.length; i++){
                if (list[i].code===code) {
                    return { status: 'error', message: `Code already in use.`, value: true}
                }
            }
            return { status: 'success', message: `Code not used.`, value: false}
        } catch (error) {
            return { status: 'error', message: `ProductManager repeatCode error: ${error}.`, value: true}
        }
    }

    save = async (newProduct) => {
        try {
            const idProd = await this.asignId();
            let id = idProd.value;
            const repeatCode = await this.repeatCode(newProduct.code);
            if (!repeatCode.value){
                const title=newProduct.title;
                const thumbnail=newProduct.thumbnail;
                const code = newProduct.code;
                const description = newProduct.description;
                let category;
                switch (parseInt(newProduct.category)) {
                    case 1:
                      category = "Categoria 1"
                      break;
                    case 2:
                        category = "Categoria 2"
                        break;
                    case 3:
                        category = "Categoria 3"
                        break;
                    case 4:
                        category = "Categoria 4"
                        break;
                    default:
                        category = "Categoria 4";
                        break;
                  }
                const stock = newProduct.stock;
                const price=newProduct.price;
                const owner = newProduct.userId;
                const prod = {id, title, thumbnail, price, code, category, stock, description, owner};
                const newProd = new Product(prod);
                await newProd.save();
                return { status: 'success', message: `New product uploaded correctly.`, value: newProd}
            } else {
                return { status: 'error', message: repeatCode.message, value: null}
            }
            
        } catch (error) {
            return { status: 'error', message: `ProductManager save Mongo DB error: ${error}.`, value: false}
        }
        
    } 

    deleteById = async (id,owner) => {
        try {
            if (parseInt(id)>0) {
                let answer = await this.getById(id);
                if (answer.status === 'success') {
                    if ((answer.value.owner.toString() === owner) || (owner === config.mailing.ADMIN_ID)) {
                        await Product.deleteOne({
                            id: id
                        })
                        return { status: 'success', message: `Product ${id} deleted.`, value: true}
                    } else {
                        return { status: 'error', message: `Product ID ${id} is not yours. You can't delete it.`, value: true}
                    }
                } else {
                    return { status: 'error', message: `Product ${id} do not exists.`, value: false}
                }
            } else {
                return { status: 'errr', message: "The ID must be an integer.", value: false}
            }
        } catch (error) {
            return { status: 'error', message: "Error en deleteById MongoDB: " + error, value: false}
        }
    }  

    updateById = async (prod, owner) => {
        let number=prod.id;
        let newObject = await Product.findOne({id: number});
        if (newObject === null) {
            return { status: 'error', message: `Product ID ${number} do not exists.`}
        } else {
            if ((owner === newObject.owner.toString()) || (owner === config.mailing.ADMIN_ID)) {
                if (prod.title !== "" ) {
                    newObject.title=prod.title
                } 
                if (prod.thumbnail != "" ) {
                    newObject.thumbnail=prod.thumbnail
                }
                if (prod.price != "" ) {
                    newObject.price=prod.price
                }
                if (prod.description != "" ) {
                    newObject.description=prod.description
                }
                if (prod.stock != "" ) {
                    newObject.stock=prod.stock
                }
                if (prod.category != "" ) {
                    switch (parseInt(prod.category)) {
                        case 1:
                            newObject.category = "Categoria 1"
                          break;
                        case 2:
                            newObject.category = "Categoria 2"
                            break;
                        case 3:
                            newObject.category = "Categoria 3"
                            break;
                        case 4:
                            newObject.category = "Categoria 4"
                            break;
                        default:
                            newObject.category = "Categoria 4"
                            break;
                      }
                }
                await Product.updateOne({id: number}, newObject)
                return { status: 'success', message: `Product ID ${number} updated.`}
            } else {
                return { status: 'error', message: `You are not the owner of the product with ID ${number}.`}
            }
            
        }}

    validateFields =  async (product) => {
        try {
            if ( (typeof product.title === 'undefined') 
                || (typeof product.description === 'undefined') 
                || (typeof product.code === 'undefined')
                //|| (typeof product.thumbnail === 'undefined')
                || (typeof product.price === 'undefined')
                || (typeof product.stock === 'undefined')
                || (typeof product.category === 'undefined')
            ){
                return { status: 'error', message: `All fields shall be completed.`, value: false}
            } else {
                return { status: 'success', message: `All fields are completed.`, value: true}
            }
        } catch (error) {
            return { status: 'error', message: `ProductManager validateFields error: ${error}`, value: false}
        }
    }

    fakerProducts = async(limit, page, sort) => {
        try {
            let contenido=[];
            for (let index = 0; index < 20; index++) {
                contenido.push(generateProduct());
            }
            return { status: 'success', message: "Products ok.", value: contenido}
            
        } catch (error) {
            return { status: 'error', message: "Error en fakerProducst MongoDB: " + error, value: null}
        }
    }

}

export default ProductMongoDB;