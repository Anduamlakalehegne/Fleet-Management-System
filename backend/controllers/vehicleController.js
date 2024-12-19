const Vehicle = require('../models/Vehicle');
const axios = require('axios');
const { BACKEND_URL } = require('../config');

exports.getAllVehicles = async (req, res, next) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/vehicles`);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/vehicles`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const response = await axios.put(`${BACKEND_URL}/api/vehicles/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

