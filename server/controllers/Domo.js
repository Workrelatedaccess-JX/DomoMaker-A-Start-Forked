// When the user visits the /maker route, this function runs.
// It shows the main application page, app.handlebars.
const makerPage = (req, res) => {
    res.render('app');
};

module.exports = {
    makerPage,
};