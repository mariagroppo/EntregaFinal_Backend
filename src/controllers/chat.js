export const getChat = async (req, res) => {
    try {
        let userName = req.session.user.name;
        res.render('../src/views/partials/chat.hbs', {userStatus: true, userName})
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getChat controller error: " + error })
    }
}
