class ApiResponse {
  success;
  message;
  data;

  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static return(success, message, data = null) {
    return new ApiResponse(success, message, data);
  }
}

module.exports = ApiResponse;
