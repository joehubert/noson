// Application constants

const SONOS_API_BASE_URL = 'https://api.ws.sonos.com/control/api/v1';
const SONOS_AUTH_BASE_URL = 'https://api.sonos.com/login/v3/oauth';

const ERROR_CODES = {
  NO_TOKEN: 'NO_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_VOLUME: 'INVALID_VOLUME',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

const VOLUME_LIMITS = {
  MIN: 0,
  MAX: 100
};

module.exports = {
  SONOS_API_BASE_URL,
  SONOS_AUTH_BASE_URL,
  ERROR_CODES,
  VOLUME_LIMITS
};
