const { vendorValidationSchema } = require('../models/vendor.model');
const fs = require('fs');

const validateVendor = (req, res, next) => {
    const { error } = vendorValidationSchema.validate({
        contactEmail: req.body.email,
        contactPhone: req.body.phone,
        address: req.body.address,
        name: req.body.name
    });

    if (error) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
            "message": error.details[0].message,
            "status": "failed"
        });
    }
    next();
};

module.exports = validateVendor;