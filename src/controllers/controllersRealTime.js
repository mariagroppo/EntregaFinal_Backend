export const getProducts = async (req, res) => {
    try {
        res.render('../src/views/partials/prod-realTime.hbs')
    } catch (error) {
        res.render('../src/views/partials/error.hbs', { message: "getProducts Real Time Controller Real Time error: " + error})
    }
}
