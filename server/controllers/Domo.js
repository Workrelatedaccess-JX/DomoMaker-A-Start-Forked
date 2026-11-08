const models = require('../models');

const Domo = models.Domo;

// Retrieve and display the Domos belonging to the logged-in user from the database
const makerPage = async (req, res) => {
    try {
        // Find domos where the 'owner' matches the ID stored in session
        const query = { owner: req.session.account._id };
        
        // Get the data, only select name and age, convert to plain JS objects
        const docs = await Domo.find(query).select('name age').lean().exec();
        
        // Render the page and pass the array of domos to the handlebars template
        return res.render('app', { domos: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};

// Create a new Domo and save it to MongoDB
const makeDomo = async (req, res) => {
    // Validate that both name and age are provided, otherwise send 400 bad request error
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'Both name and age are required!' });
    }

    // This is an object containing the information needed to create a Domo
    const domoData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id, // store the ID of the logged-in user as the owner of this Domo
    };

    // Try to create a new Domo and save it to the database
    try {
        // Create a new Domo instance with the provided data, 
        // then wait for it to be saved to the database, 
        // and then return a JSON response indicating success and redirect to the maker page.
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.json({ redirect: '/maker' });
    } catch (err) {
        // Handle any errors, which include duplication errors (code 11000) and other database errors
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred making domo!' });
    }
};

module.exports = {
    makerPage,
    makeDomo,
};