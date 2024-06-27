const mongoose = require("mongoose");
const leadModel = require('../models/leads')

// To create a lead - POST
const createLeads = async (req, res) => {
    const { name , email , phone , password , requesttype } = req.body;
    try {
      const Lead = await leadModel.create({ name , email , phone , password , requesttype });
      res.status(200).json(Lead);
    } catch  {
      res.status(400).json({ error: "no data" });
    }
  };

  
module.exports = { createLeads };