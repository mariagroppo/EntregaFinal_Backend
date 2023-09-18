import { productService } from '../services/repository.js';
import { validateLimit, validatePage } from '../../utils.js';
import { mailDeleteProduct } from '../mail/nodemailer.js';

const getProducts = async (req, res) => {
    let userName = req.session.user.name;
    let userId = req.session.user.id;
    //enabled habilta a la edicion de prductos.
    let enabled = true;
    if ((req.url === '/products') || (req.url === '/')) {
        enabled = false;
    }
    if (userName === 'admin') {
        enabled = true;
    }
    try {
        let { limit, page, sort, category } = req.query;
        let validPage = await validatePage(page); //devuelve 1 si no está definida o mal definida.
        let validLimit = await validateLimit(limit); //devuelve 10 si está mal definido o el valor inicial si esta OK.
        if ((Number(sort) !== 1) && (Number(sort) !== -1)) {
            sort=1; 
        }
        let listado = await productService.getAll(validLimit,validPage,sort,category,userId,enabled);
        let hasPrevPage = listado.value.hasPrevPage;
        let hasNextPage = listado.value.hasNextPage;
        let prevPage = listado.value.prevPage;
        let nextPage = listado.value.nextPage;
        let values;
        if (listado.value.docs.length>0){
            let values = {
                prods: listado.value.docs,
                productsExists: true,
                realTime: false,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                validPage,
                validLimit,
                sort,
                category,
                enabled
            };
            res.sendSuccessMessageAndValue("Products list ok", values)
            
        } else {
            values = {
                prods: [],
                productsExists: false,
                realTime: false,
                enabled
            };
            res.sendSuccessMessageAndValue("No products available.", values)
        }
        
    } catch (error) {
        res.sendErrorMessage("getProducts Controller error: " + error)
    }
}

const addProductForm = async (req, res) => {
    try {
        res.sendSuccessMessage("Please, complete the following information about your new product: title, description, code, thumbnail, price, stock, category.");
    } catch (error) {
        res.sendErrorMessage("getProducts Controller error: " + error)
    }
}

const addProduct = async (req, res) => {
    let userId = req.session.user.id;
    try {
        const {title, description, code, thumbnail, price, stock, category} = req.body;
        let validateFields= await productService.validateFields(req.body);
        if (validateFields.value === true) {
            const prod = {title, description, code, thumbnail, price, stock, category, userId};
            const newProd = await productService.save(prod);
            res.sendStatusAndMessage(newProd.status, newProd.message)
        } else {
            res.sendErrorMessage(validateFields.message)
        }
    } catch (error) {
        res.sendErrorMessage("BACK addProduct Controller error: " + error)
    }
}

const getProductById = async (req, res) => {
    try {
        let product = await productService.getById(req.params.pid);
        res.sendStatusMessageAndValue(product.status,product.message,product.value)
    } catch (error) {
        res.sendErrorMessage("BACK getProductById Controller error: " + error)
    }
}

const updateProductById = async (req, res) => {
    let userId = req.session.user.id;
    try {
        const {title, description, thumbnail, price, stock, category} = req.body;
        let id = req.params.pid;
        const newProd = {
            id: parseInt(id),
            title: title,
            description: description,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
            category: category
        }
        if (isNaN(id)){
            res.sendErrorMessage("The ID must be a number.")
        } else {
            const answer = await productService.updateById(newProd,userId);
            res.sendStatusAndMessage(answer.status,answer.message)
        }
    } catch (error) {
        res.sendErrorMessage("updateProductById Controller error: " + error)
    }
}

const deleteProductById = async(req,res)=> {
    let userId = req.session.user.id;
    let user = req.session.user;
    try {
        let id = parseInt(req.params.pid);
        if (!isNaN(id)) {
            let product = await productService.getById(id);
            let answer = await productService.deleteById(id,userId);
            //console.log("Respuesta de deleteById: " + answer)
            if (answer.status === 'success') {
                await mailDeleteProduct(user, product.value)
            }
            res.sendStatusAndMessage(answer.status,answer.message)
        } else {
            res.sendErrorMessage("The ID must be a number.")
        }
    } catch (error) {
        res.sendErrorMessage("deleteProductById Controller error: " + error)
    }
}

export default {
    getProducts,
    getProductById,
    addProductForm,
    addProduct,
    updateProductById,
    deleteProductById
}