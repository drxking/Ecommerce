const { vendorValidationSchema } = require('../models/vendor.model');

const validateVendor = (req, res, next) => {
    console.log(req.body);
    const { error } = vendorValidationSchema.validate({
        contactEmail: req.body.email,
        contactPhone: req.body.phone,
        address: req.body.address,
        name: req.body.name
    });
    if (error) {
        return res.status(400).json({
            "message": error.details[0].message,
            "status": "failed"
        });
    }
    next();
};

module.exports = validateVendor;