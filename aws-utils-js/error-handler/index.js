class ApiError extends Error {
  constructor(message, name, code, extra, devMsg) {
    super(message);

    this.name = name || 'UNKNOWN_ERROR';
    this.cause = name || 'UNKNOWN_ERROR';
    this.code = code || 500;
    this.extra = extra || {};
    this.devMessage = devMsg || '';
  }
}

module.exports = ApiError;
