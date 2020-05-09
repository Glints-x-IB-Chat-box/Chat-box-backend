const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";
  // Username validator
  if (Validator.isEmpty(data.username)) {
    errors.status = "invalid";
    errors.name = "username is required";
  }
  // Email validator
  if (Validator.isEmpty(data.email)) {
    errors.status = "invalid";
    errors.email = "Email is invalid";
  }
  // Phone Number validator
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.status = "invalid";
    errors.phoneNumber = "Phone number field is required";
  }
  // Password validator
  if (Validator.isEmpty(data.password)) {
    errors.status = "invalid";
    errors.password = "Password is required";
  }
  if (Validator.isEmpty(data.confirmPassword)) {
    errors.status = "invalid";
    errors.confirmPassword = "Confirm password is required";
  }
  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.status = "invalid";
    errors.password = "Password must be at least 8 characters";
  }
  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.status = "invalid";
    errors.confirmPassword = "Password must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
