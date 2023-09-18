import { Router } from "express";

//Clase padre
export default class BaseRouter {

    constructor(){
        this.router = Router();
        this.init();
    }

    getRouter() {  //Para poder acceder al router de express desde afuera.
        return this.router;
    }

    init() {}

    get(path, policies, ...callbacks) {
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    put(path, policies, ...callbacks){
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyallbacks(callbacks))
    }

    //POLICIES
    handlePolicies = policies => {
        return (req,res,next) => {
            const user = req.session.user;
            //console.log("ROUTER policies: " + user.role)
            if ((policies[0].toUpperCase() === 'PUBLIC')) return next();
            if (!user) return res.redirect('/login');
            if ((policies[0].toUpperCase() === 'ADMIN') && (user.role.toUpperCase() === 'ADMIN')) return next();
            if ((policies[0].toUpperCase() === 'ADMIN') && (user.role.toUpperCase() !== 'ADMIN')) return res.render('../src/views/partials/forbidden.hbs', {userStatus: true, userName: req.session.user.name })
            if ((policies[0].toUpperCase() === 'PREMIUM') && ((user.role.toUpperCase() === 'PREMIUMUSER') || (user.role.toUpperCase() === 'ADMIN'))) return next();
            if ((policies[0].toUpperCase() === 'PREMIUM') && (user.role.toUpperCase() !== 'PREMIUMUSER')) return res.render('../src/views/partials/forbidden.hbs', {userStatus: true, userName: req.session.user.name });
            if ((policies[0].toUpperCase() === 'USER')) return next();
            req.user = user;
            next();
        }
    }

    // HOMOLOGACIÓN DE RESPUESTAS
    generateCustomResponses = (req, res, next)=> {
        res.sendErrorMessage = message => res.status(500).send({status:'error', message});
        res.sendInternalErrorMessage = message => res.status(400).send({status:'error', message});
        res.sendErrorMessageAndValue = (message, payload) => res.send({status:'error', message, payload});
        
        res.sendSuccessMessage = message => res.status(200).send({status:'success', message});
        res.sendSuccessMessageAndValue = (message, payload) => res.status(200).send({status:'success', message: message, payload:payload});
        res.sendStatusAndMessage = (status, message) => res.send({status: status, message: message});
        res.sendStatusMessageAndValue = (status, message, payload) => res.send({status: status, message: message, payload: payload});
        
        res.renderInternalError = (message, userStatus) => res.render('../src/views/partials/error.hbs', {
            message: message,
            userStatus: userStatus})
        next();
    }

    applyallbacks (callbacks) {
        return callbacks.map(callback=>async(...params)=> {
            try {
                // this = contexto del servidor
                await callback.apply(this,params)
            } catch (error) {
                //params[1] es res
                params[1].status(500).send(error);
            }
        })
    }

}