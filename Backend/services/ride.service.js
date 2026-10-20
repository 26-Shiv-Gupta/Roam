const mapsService = require('../services/maps.service');
const rideModel = require('../models/ride.model')
const crypto = require('crypto');

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
        auto: Number((baseFare.auto + (farePerKm.auto * (distanceTime.distance.value / 1000)) + (farePerMinute.auto * (distanceTime.duration.value / 60))).toFixed(2)),
        car: Number((baseFare.car + (farePerKm.car * (distanceTime.distance.value / 1000)) + (farePerMinute.car * (distanceTime.duration.value / 60))).toFixed(2)),
        motorcycle: Number((baseFare.motorcycle + (farePerKm.motorcycle * (distanceTime.distance.value / 1000)) + (farePerMinute.motorcycle * (distanceTime.duration.value / 60))).toFixed(2))
    };
    return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
    const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();

    return otp;
}

module.exports.createRide = async ({user, pickup, destination, vehicleType}) => {

    if(!user || !pickup || !destination || !vehicleType) {
        throw new Error('User ID, pickup, destination and vehicle type are required');
    }
    
    const fare = await getFare(pickup, destination);

    const ride = rideModel.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        otp: getOtp(4)
    });

    return ride;
}

module.exports.confirmRide = async (rideId, captainId) => {
    if (!rideId || !captainId) {
        throw new Error('RideId and CaptainId is required !!')
    }

    await rideModel.findOneAndUpdate({_id: rideId}, {
        status: 'accepted',
        captain: captainId
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp')

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
}

module.exports.startRide = async(rideId, otp, captainId) => {
    if(!rideId || !otp || !captainId) {
        throw new Error('Ride id, otp and captianId is required')
    }

    const ride = await rideModel.findOne({_id: rideId}).populate('user').populate('captain').select('+otp')

    if (!ride) {
        throw new Error('Ride not found')
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted')
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid Otp')
    }

    await rideModel.findOneAndUpdate({_id: rideId}, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.finishRide = async(rideId) => {
    if(!rideId) {
        throw new Error('ride id is required')
    }

    const ride = await rideModel.findOne({_id: rideId}).populate('user')

    if(!ride) {
        throw new Error('ride not found')
    }

    if(ride.status !== 'ongoing') {
        throw new Error('No ongoing ride')
    }

    await rideModel.findOneAndUpdate({_id: rideId}, {
        status: 'completed'
    })

    return ride;
}