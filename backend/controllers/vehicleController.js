const Vehicle = require('../models/Vehicle');
const axios = require('axios');
const { BACKEND_URL } = require('../config');

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    handleError(err, res);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const newVehicle = new Vehicle(req.body);
    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updatedVehicle);
  } catch (err) {
    handleError(err, res);
  }
};

