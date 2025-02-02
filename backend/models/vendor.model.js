const mongoose = require("mongoose");
const Joi = require("joi");

let vendorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [2, " name must be at least 2 characters long"],
        maxLength: [100, " name must be less than 100 characters"]
    },

    imageLink: {
        type: String,
        required: true
    },

    contactEmail: {
        type: String,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },

    contactPhone: {
        type: String,
        required: true,
        match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"]
    },

    address: {
        type: String,
        required: true,
        maxLength: [200, "Address must be less than 200 characters"]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports.vendorValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 3 characters long',
            'string.max': 'Name must be less than 50 characters',
            'any.required': 'Name is required'
        }),

    contactEmail: Joi.string()
        .email({ tlds: { allow: ['com', 'net', 'org'] } }) // Allow only specific TLDs
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),

    contactPhone: Joi.string()
        .pattern(/^\+?[\d\s-]{10,15}$/) // Allow phone numbers with 10 to 15 digits
        .required()
        .messages({
            'string.pattern.base': 'Please enter a valid phone number',
            'any.required': 'Phone number is required'
        }),

    address: Joi.string()
        .min(10)
        .max(200)
        .required()
        .messages({
            'string.min': 'Address must be at least 10 characters long',
            'string.max': 'Address must be less than 200 characters',
            'any.required': 'Address is required'
        }),

    createdAt: Joi.date()
        .default(Date.now)
});

module.exports.vendorModel = mongoose.model("vendor", vendorSchema);