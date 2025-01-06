const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    candidateHash: {type:String, unique: true, required: true},
    totalVotes: {type: Number, default: 0}
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;