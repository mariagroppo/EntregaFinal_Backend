const pageNotFound = async (req, res) => {
    res.sendErrorMessage("Page not found. " + req.url);
}

const views_pageNotFound = async (req, res) => {
    let userName = req.session.user.name;
    let userRole = req.session.user.role;
    let myProducts = false;
    if (userRole === 'premiumUser') {
        myProducts = true;
    }
    let enabled = false;
    if (userName === 'admin') {
        enabled = true;
        edition = true;
        purchase=true;
    }
    try {
        res.render('../src/views/partials/pageNotFound.hbs', { userStatus: true, userName, enabled, edition, myProducts});
    } catch (error) {

            return res.renderInternalError('registerForm controller error.', false,  userName, enabled, edition, myProducts)
    } 
}

export default {
    pageNotFound,
    views_pageNotFound
}