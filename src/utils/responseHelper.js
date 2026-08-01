const sendSuccess = (res, statusCode, message, data) => {
  const response = {
    success: true,
    message,
  };
  
  // Use explicit undefined check to allow valid falsy payloads (e.g., 0, false, null, empty array)
  if (data !== undefined) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors) => {
  const response = {
    success: false,
    message,
  };
  
  // Use explicit undefined check to allow valid falsy error payloads
  if (errors !== undefined) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  sendSuccess,
  sendError
};
