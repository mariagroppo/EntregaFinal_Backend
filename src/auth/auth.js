export const privacy = (privacyType) => {
    return async (req, res, next) => {
        const {user} = req.session;
        switch (privacyType) {
            case 'PRIVATE':
            //Deja continuar con el proceso a aquellos que se encuentren logueads.
                if (user) next();
                else res.redirect('/api/sessions/login')
                break;
            //Si no estás logueado, continuas. Sino, te redirige al home.
            case "NO_AUTHENTICATED":
                if (!user) next();
                else res.redirect('/api/products')
        }
    }
}

export const authRoles = (role) => {
    return async (req, res, next) => {
        //Si llegue a este punto, SIEMPRE debo tener un usuario logueado.
        const {userRole} = req.session.user.role;
        if (userRole !== role) return res.status(403).send({status:"error", error: "Forbidden."})
        next();
    }
}

