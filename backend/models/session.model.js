// const mongoose = require("mongoose");
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        value: {
            type: String, // or Mixed if value can be various types
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
        url: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Optional: add a unique index on _id (MongoDB adds this by default)
sessionSchema.index({ _id: 1 }, { unique: true });

// const SessionModel = mongoose.model("Session", sessionSchema);

// module.exports = SessionModel;

export const SessionModel = mongoose.model("Session", sessionSchema);
