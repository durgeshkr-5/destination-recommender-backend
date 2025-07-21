const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    profile: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true
        },
        avatar: String,
        preferences: {
            interests: [{
                type: String,
                enum: ['adventure', 'relaxation', 'cultural', 'nature', 'nightlife', 'food', 'historical', 'sports','beach', 'mountain', 'city', 'wellness' ]
            }],
            budgetRange: {
                min: { type: Number, default: 0 },
                max: { type: Number, default: 100000 }
            },
            travelStyle: {
                type: String,
                enum: ['solo', 'couple', 'family', 'group', 'luxury'],
                default: 'solo'
            },
            activities: [String]
        }
    },
    travelHistory: [{
        destinationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Destination'
        },
        visitDate: Date,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    savedDestinations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    }],
    itineraries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


const User = mongoose.model("User", userSchema);
module.exports = User;
