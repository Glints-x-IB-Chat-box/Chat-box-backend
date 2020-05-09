const status = require("http-status-codes");

module.exports = {
  error: (response, message) => {
    return response.status(status.INTERNAL_SERVER_ERROR).send(message);
  },
  success: (response, message) => {
    return response.status(status.OK).send(message);
  },
};
