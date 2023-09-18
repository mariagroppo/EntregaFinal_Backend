import passport from 'passport';
import local from 'passport-local';
//import UserModel from "../dao/mongodb/models/userModel.js";
import GithubStrategy from 'passport-github2';

/* PASSPORT --------------------------------------------------------------------------------------- */
/* register   es como se llama el método de autenticación
Recibe 1ro un objeto de configuración (lo que recibimos del cliente) y dedspués un callback de ejecución
passReqToCallback: true hace que se pueda recibir el req en el callback de ejecución
done es un callback que se usa para devolverle una rta al cliente
 */

import { createHash } from '../../utils.js';
import { userService } from '../services/repository.js';
import config from '../config/config.js';

const LocalStrategy = local.Strategy; // UNA ESTRATEGIA LOCAL SIEMPRE SE BASA EN EL USERNAME + PASSWORD


const initializePassport = () => {
    passport.use('register', new LocalStrategy({usernameField: 'userEmail', passwordField: 'inputPassword', passReqToCallback:true}, async (req, userEmail, inputPassword, done) => {
        try {
            const {first_name, last_name} = req.body;
            const hashedPassword = await createHash(inputPassword);
            const last_connection = "";
            if (userEmail !== config.mailing.ADMIN_MAIL){
                const user = {
                    first_name,
                    last_name,
                    hashedPassword,
                    userEmail,
                }
                const result = await userService.createUser(user);
                //Wconsole.log(result.message)
                if (result.status === 'success') {
                    done(null,result.value);
                } else {
                    //done lo que quiere hacer es devolver un req.user. Al poner false, es porque no hay.
                    done(null,false,{message: result.message})
                }
            } else {
                done(null,false,{message: 'Email not allowed.'})
            }
        } catch (error) {
            done(error)
        }    
    }))


    passport.use('login', new LocalStrategy({usernameField: 'userEmail', passwordField: 'inputPassword', passReqToCallback: true}, async (req, userEmail, inputPassword, done) => {
        try {
            let user;
            if (userEmail === config.mailing.ADMIN_MAIL && inputPassword === config.mailing.ADMIN_PWD) {
                user = {
                    id: config.mailing.ADMIN_ID,
                    name: "admin",
                    email: userEmail,
                    role: 'admin'
                  };
                done(null, user);
            } else { 
                const userLogin = await userService.checkPassword(userEmail, inputPassword);
                if (userLogin.status === "success") {
                    user = {
                        id: userLogin.value._id,
                        name: `${userLogin.value.first_name} ${userLogin.value.last_name}`,
                        email: userLogin.value.userEmail,
                        role: userLogin.value.role
                    };
                    const answer = await userService.lastConnection(userEmail);
                    done(null, user);
                } else {
                    req.session.message = userLogin.message;
                    done(null, false, {message: 'Incorrect Password.'});
                }
            }  
        } catch (error) {
            done(error)
        }  
    }));

    /* CONFIGURACION GitHub -------------------- */
    /* Settings/Developer settings */

    passport.use('github', new GithubStrategy ({
        clientID:"Iv1.7b4e51f88c2ac187",
        clientSecret: "e2792d803bed0fffd60471ae6f784c20f522717d",
        callbackURL: "http://localhost:8080/views/login/githubcallback",
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            //Tomo los datos que me sirven: name, email.
            //console.log("adentr de estrategia github")
            const {name, email, id } = profile._json;
            const user = (await userService.getUserByEmail(email)).value;
            let newUser;
            if (!user) {
                //Creo el usuario.
                newUser = {
                    id: id,
                    first_name: name,
                    userEmail: email,
                    hashedPassword:''
                }
                //al no poner pwd, conviene enviar un correo y pedirle que reestablezca la misma.
                const result = (await userService.createUser(newUser)).value;
                done(null, result);
            } else {
                user.id = user._id;
                done(null, user);
            }
        } catch (error) {
            done(error)
        }
    } ))


    /* Se guarda el usuario internamente en el navegador para que no tenga que autenticarse constantemente */
    /* Cada vez que el usuario va a otra página devuelve el id */
    passport.serializeUser((user, done) => {
        //console.log("serial user: " + user)
        done(null, user.id);
    });
    
    /* Recibe id almacenado y hace el proceso inverso */
    passport.deserializeUser(async (id, done) => {
        let user;
        if (id === config.mailing.ADMIN_ID){
            user = {
                id: config.mailing.ADMIN_ID,
                name: "admin",
                email: userEmail,
                role: 'admin'
              };
        } else {
            user = await UserModel.findOne({id: id});
        }
        done(null, user);
    });
}

export default initializePassport;