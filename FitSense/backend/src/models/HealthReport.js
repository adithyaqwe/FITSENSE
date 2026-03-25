const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bmi: {
        type: Number,
        required: true,
    },
    sugarLevel: {
        type: String, // e.g., 'Normal', 'High'
        required: true,
    },
    hemoglobin: {
        type: Number,
        required: true,
    },
    injuries: {
        type: [String],
        default: [],
    },
    generatedPlan: {
        gym: {
            type: Map,
            of: [String], // Day -> [Exercises]
        },
        diet: {
            type: Map,
            of: [String], // Day -> [Meals]
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const HealthReport = mongoose.model('HealthReport', healthReportSchema);
module.exports = HealthReport;
