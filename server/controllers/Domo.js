const models = require('../models');

const Domo = models.Domo;

// Retrieve and display the Domos belonging to the logged-in user from the database
const makerPage = (req, res) => res.render('app');

// Retrieve the Domos belonging to the logged-in user from the database and return them as JSON
const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Domo.find(query).select('name age').lean().exec();
        return res.json({ domos: docs });
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
        return res.status(201).json({ name: newDomo.name, age: newDomo.age });
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
    getDomos,
    makeDomo,
};