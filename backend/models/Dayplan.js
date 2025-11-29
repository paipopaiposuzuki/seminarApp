const mongoose = require('mongoose')

const TimeBlockSchema = new mongoose.Schema({
    title: { type: String, required: true},
    start: { type: String, required: true},
    end: { type: String, required: true},
    location: {
        type: String,
        enum: ['campus', 'station', 'home', 'other'],
        required: true
    }
})
const FreeSlotSchema = new mongoose.Schema({
    start: {type: String, required: true},
    end: {type: String, required: true},
    baseLocation: {
        type: String,
        enum: ['campus', 'station', 'home', 'other'],
        required: true,
    }
})
const DayplanSchema = new mongoose.Schema({
    date: { type: String,required:true},
    blocks: [TimeBlockSchema],
    freeSlots: [FreeSlotSchema],
    //予算や気分を後で足す
    createdAt: {type: Date, default: Date.now}
})

const Dayplan = mongoose.model('Dayplan', DayplanSchema)

module.exports = Dayplan