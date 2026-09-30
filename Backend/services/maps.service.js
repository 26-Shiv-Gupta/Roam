const axios = require('axios')

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;

            return {
                ltd: location.lat,
                lng: location.lng
            }
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch(err) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {

    if(!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to fetch distance and time');
        }
    } catch(err) {
        console.error(error);
        throw error;
    }
}

module.exports.getAddressSuggestions = async (address) => {
    const apiKey = process.env.MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch address suggestions');
        }
    } catch(error) {
        console.error(error);
        throw error;
    }
}