const SonosService = require('../services/sonosService');

/**
 * Get user's Sonos households
 */
async function getHouseholds(req, res, next) {
  try {
    const sonosService = new SonosService(req.userId);
    const households = await sonosService.getHouseholds();
    
    res.json({
      success: true,
      data: households
    });
  } catch (error) {
    console.error('Get households error:', error);
    next(error);
  }
}

module.exports = {
  getHouseholds
};
