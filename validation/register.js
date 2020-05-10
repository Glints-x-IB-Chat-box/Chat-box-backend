const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {
    status: '',
    error: {
      username: '',
      email: '',
      phoneNumber: '',
      userpasswordname: '',
      confirmPassword: ''
    }
  };
  data.username = !isEmpty(data.username) ? data.username : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.confirmPassword = !isEmpty(data.confirmPassword)
    ? data.confirmPassword
    : "";
  // Username validator
  if (Validator.isEmpty(data.username)) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      username : "username is required"
    };
  }
  // Email validator
  if (Validator.isEmpty(data.email)) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      email: "Email is invalid"
    };
  }
  // Phone Number validator
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      phoneNumber: "Phone number field is required"
    };
  }
  // Password validator
  if (Validator.isEmpty(data.password)) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      password: "Password is required"
    };
  } else if (!Validator.isLength(data.password, {
      min: 8,
      max: 30
  })) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      password: "Password must be at least 8 characters"
    };
  }

  if (Validator.isEmpty(data.confirmPassword)) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      confirmPassword: "Confirm password is required"
    };
  } else if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.status = "error";
    errors.error = {
      ...errors.error,
      confirmPassword: "Password must match"
    };
  }
  return {
    errors,
    isValid: isEmpty(errors.status),
  };

  /**
   * expected response
   {
     "status": "error",
     "error": {
       "name": "username is required", //optional
       "email": "Email is invalid", //optional
       "phoneNumber": "Phone number field is required" //optional
       "password": "Password is required" //optional
       "confirmPassword": "Confirm password is required" //optional
     }
   }
   */
};
