const captainModel = require('../models/captain.model');

module.exports.createCaptain = async ({
    firstname, lastname, email, password, status, color, plate, capacity, vechileType, lat, lng
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vechileType) {
        throw new Error('All fields are required');
    }

    const captain = captainModel.create({
        fullname : {
            firstname, 
            lastname
        },
        email, 
        password,
        status,
        vechile : {
            color,
            plate, 
            capacity,
            vechileType
        },
        location : {
            lat, 
            lng
        }
    })

    return captain;
}