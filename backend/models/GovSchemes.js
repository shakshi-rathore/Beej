const mongoose = require('mongoose');

const GovSchemeSchema = new mongoose.Schema({
  title: String,
  description: String,
  document: String,
});

// ✅ Force collection name to match exactly: 'govSchemes'
module.exports = mongoose.model('GovScheme', GovSchemeSchema, 'govSchemes');
