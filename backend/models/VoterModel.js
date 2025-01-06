const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
    cccdHash: { type: String, unique: true, required: true},
});

const Voter = mongoose.model('Voter', voterSchema);

module.exports = Voter;