const { model, Schema } = require("mongoose");

const VictimSchema = new Schema({
    identificator: {
        type: String,
        required: true
    },
    devicename: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    os: {
        type: String
    },
    local_ip: {
        type: String
    },
    public_ip: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    provider: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    timestampUpdate: {
        type: Date,
        default: Date.now
    },
    screenshots: {
        type: Array
    }
});

module.exports = model("Victim", VictimSchema);