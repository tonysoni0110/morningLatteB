// models.js
const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  elements: [
    {
      classname: { type: String },
      content: {type: String},
      icons: { type: String, required: true },
    },
  ],
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;
