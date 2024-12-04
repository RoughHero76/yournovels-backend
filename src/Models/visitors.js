//src/models/visitors.js
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    visitorId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: 'Unknown'
    },
    city: {
        type: String,
        default: 'Unknown'
    },
    region: {
        type: String,
        default: 'Unknown'
    },
    userAgent: {
        type: String
    },
    referrer: {
        type: String
    },
    firstVisit: {
        type: Date,
        default: Date.now
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    visitCount: {
        type: Number,
        default: 1
    },
    pageViews: {
        type: Number,
        default: 1
    },
    deviceInfo: {
        type: {
            browser: String,
            os: String,
            platform: String
        }
    },
    geoLocation: {
        type: {
            latitude: Number,
            longitude: Number
        }
    }
}, {
    timestamps: true
});

// Create an index to improve query performance
visitorSchema.index({ visitorId: 1, lastVisit: -1 });

// Method to update visitor information
visitorSchema.statics.updateVisitorInfo = async function (visitorData) {
    try {
        // Try to find an existing visitor
        let visitor = await this.findOne({ visitorId: visitorData.visitorId });

        if (visitor) {
            // Update existing visitor
            visitor.lastVisit = new Date();
            visitor.visitCount += 1;
            visitor.pageViews += 1;

            // Update other fields if they've changed
            visitor.country = visitorData.country || visitor.country;
            visitor.city = visitorData.city || visitor.city;
            visitor.region = visitorData.region || visitor.region;

            await visitor.save();
            return visitor;
        } else {
            // Create new visitor
            visitor = new this(visitorData);
            await visitor.save();
            return visitor;
        }
    } catch (error) {
        console.error('Error updating visitor info:', error);
        throw error;
    }
};

module.exports = mongoose.model('Visitor', visitorSchema);