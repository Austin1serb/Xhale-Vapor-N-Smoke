
const axios = require('axios');
require('dotenv').config();

exports.getAutocompleteSuggestions = async (req, res) => {
    try {
        const { input } = req.query;
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
            params: {
                input: input,
                key: process.env.GOOGLE_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
