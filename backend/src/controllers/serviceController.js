const SonosService = require('../services/sonosService');

/**
 * Get music services for a household
 */
async function getMusicServices(req, res, next) {
  try {
    const { householdId } = req.params;
    const sonosService = new SonosService(req.userId);
    const services = await sonosService.getMusicServices(householdId);
    
    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get music services error:', error);
    next(error);
  }
}

module.exports = {
  getMusicServices
};
