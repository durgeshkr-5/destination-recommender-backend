const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 2000,
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      coordinates: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
    },
    images: [
      {
        url: String,
        caption: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    categories: [
      {
        type: String,
        enum: [
          "beach",
          "mountain",
          "city",
          "historical",
          "adventure",
          "cultural",
          "nature",
          "religious",
        ],
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
    attractions: [String],
    bestTimeToVisit: [
      {
        season: {
          type: String,
          enum: ["spring", "summer", "autumn", "winter"],
        },
        months: [String],
        description: String,
      },
    ],
    estimatedCost: {
      budget: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
      midRange: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
      luxury: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
    },
    activities: [String],
    tags: [String],
    weatherInfo: {
      climate: String,
      averageTemp: {
        min: Number,
        max: Number,
        unit: {
          type: String,
          default: "Celsius",
        },
      },
    },
    travelTips: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;
