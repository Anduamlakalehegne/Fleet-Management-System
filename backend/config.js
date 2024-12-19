require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://fleetUser:fleetUser%40123@cluster0.0v3cs.mongodb.net/vehicle_management',
};

