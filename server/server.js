require('dotenv').config({path: '/Speedtest/.env'}); 

const Joi = require('joi');
const firebaseAdmin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

const DEBUG = true;

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});
const db = firebaseAdmin.firestore();


const speedtestSchema = Joi.object({
  download: Joi.object({
    bandwidth: Joi.number().positive().required().messages({
      'number.base': '"download.bandwidth" must be a number',
      'number.positive': '"download.bandwidth" must be greater than zero',
      'any.required': '"download.bandwidth" is required',
    }),
    bytes: Joi.number().min(0).required().messages({
      'number.base': '"download.bytes" must be a number',
      'number.min': '"download.bytes" must be zero or greater',
      'any.required': '"download.bytes" is required',
    }),
    elapsed: Joi.number().positive().required().messages({
      'number.base': '"download.elapsed" must be a number',
      'number.positive': '"download.elapsed" must be greater than zero',
      'any.required': '"download.elapsed" is required',
    }),
  }).required().messages({
    'object.base': '"download" must be an object',
    'any.required': '"download" is required',
  }),
  upload: Joi.object({
    bandwidth: Joi.number().positive().required(),
    bytes: Joi.number().min(0).required(),
    elapsed: Joi.number().positive().required(),
  }).required(),
  ping: Joi.object({
    jitter: Joi.number().min(0).required(),
    latency: Joi.number().min(0).required(),
  }).required(),
  packetLoss: Joi.number().min(0).max(100).required(),
  isp: Joi.string().required(),
  interface: Joi.object({
    internalIp: Joi.string().ip().required(),
    name: Joi.string().required(),
    macAddr: Joi.string().pattern(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/).required(),
    isVpn: Joi.boolean().required(),
    externalIp: Joi.string().ip().required(),
  }).required(),
  server: Joi.object({
    id: Joi.number().required(),
    host: Joi.string().required(),
    port: Joi.number().min(1).max(65535).required(),
    name: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    ip: Joi.string().ip().required(),
  }).required(),
  result: Joi.object({
    id: Joi.string().guid().required(),
    url: Joi.string().uri().required(),
  }).required(),
});
const storeSpeedtestData = async (req, res) => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
      }
      const speedtestData = req.body;

    
        try{
          const value = await speedtestSchema.validateAsync(speedtestData);
          if(DEBUG) console.log('Data validated:', value);

          const docRef = db.collection('speedtests').doc();
          await docRef.set(value); 
          return res.status(200).json({ message: 'Data stored successfully!' });
    

        } catch (error) {
          console.error('Invalid data:', error);
          return res.status(400).json({ error: 'Invalid data', details: error.message });
        }
      

    } catch (error) {
      console.error('Error processing data:', error);
      res.status(500).json({ error: 'Failed to process data', details: error.message });
    }
  };

  module.exports = storeSpeedtestData;