const mapsService = require('../services/maps.service');

async function getFare(pickup, destination) {

    if(!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime  = await mapsService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        motorcycle: 20
    }

    const farePerKm = {
        auto: 10,
        car: 15,
        motorcycle: 5
    };

    const farePerMinute = {
        auto: 2,
        car: 3,
        motorcycle: 1
    };

    const fare = {
        auto: baseFare.auto + (farePerKm.auto * (distanceTime.distance.value / 1000)) + (farePerMinute.auto * (distanceTime.duration.value / 60)),
        car: baseFare.car + (farePerKm.car * (distanceTime.distance.value / 1000)) + (farePerMinute.car * (distanceTime.duration.value / 60)),
        motorcycle: baseFare.motorcycle + (farePerKm.motorcycle * (distanceTime.distance.value / 1000)) + (farePerMinute.motorcycle * (distanceTime.duration.value / 60))
    };
    return fare;
}

function getOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();

    return otp;
}

module.exports.createRide = async (userId, pickup, destination, vehicleType) => {

    if(!userId || !pickup || !destination || !vehicleType) {
        throw new Error('User ID, pickup, destination and vehicle type are required');
    }

    const fare = await getFare(pickup, destination);

    const ride = ridModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fare[vehicleType]
    });

    return ride;
}