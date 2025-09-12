const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  farmerUid: { type: String, required: true },
  contractId: String,
  title: String, // e.g., "Tomato + Tilapia Combo"
  type: String, // crop/fish/poultry/multi
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['Active', 'Upcoming', 'Completed'] },
  nextAction: String,
  productionPromised: String, // "5 tons tomatoes, 100kg fish"
  cost: Number,
  costBreakdown: [String],
  assuredReturn: String, // e.g., ₹35000/month or 70:30
  servicesProvided: [String],
  farmerContribution: [String],
  documents: [String],
  photos: [String],
  fieldReports: [String],
  invoices: [String],
  totalSales: Number,
  monthlySales: [Number],
  pendingPayments: Number,
  upcomingPayouts: Date
}, { timestamps: true });

module.exports = mongoose.model('Contract', ContractSchema);
