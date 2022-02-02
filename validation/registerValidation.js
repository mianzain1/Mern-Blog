const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
    let errors = {};

    // check the email field
    if (isEmpty(data.email)) {
        errors.email = "Email field can not be empty";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid, please provide a valid email";
    }

    // check password field
    if (isEmpty(data.password)) {
        errors.password = "Password field can not be empty";
    } else if (!Validator.isLength(data.password, { min: 6, max: 150 })) {
        errors.password = "Password must be between 6 and 150 characters long";
    }

    // check name field
    if (isEmpty(data.username)) {
        errors.username = "Name field can not be empty";
    } else if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = "Name must be between 2 and 30 characters long";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};

module.exports = validateRegisterInput;