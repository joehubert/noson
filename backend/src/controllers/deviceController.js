const SonosService = require('../services/sonosService');

/**
 * Get groups (devices) in a household
 */
async function getGroups(req, res, next) {
  try {
    const { householdId } = req.params;
    const sonosService = new SonosService(req.userId);
    const groups = await sonosService.getGroups(householdId);
    
    res.json({
      success: true,
      data: groups
    });
  } catch (error) {
    console.error('Get groups error:', error);
    next(error);
  }
}

/**
 * Get volume for a specific group
 */
async function getVolume(req, res, next) {
  try {
    const { groupId } = req.params;
    const sonosService = new SonosService(req.userId);
    const volume = await sonosService.getVolume(groupId);
    
    res.json({
      success: true,
      data: volume
    });
  } catch (error) {
    console.error('Get volume error:', error);
    next(error);
  }
}

/**
 * Set volume for a specific group
 */
async function setVolume(req, res, next) {
  try {
    const { groupId } = req.params;
    const volumeData = req.body;
    
    // Validate volume data
    if (volumeData.volume !== undefined) {
      if (volumeData.volume < 0 || volumeData.volume > 100) {
        return res.status(400).json({
          success: false,
          error: { 
            code: 'INVALID_VOLUME', 
            message: 'Volume must be between 0 and 100' 
          }
        });
      }
    }
    
    const sonosService = new SonosService(req.userId);
    const result = await sonosService.setVolume(groupId, volumeData);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Set volume error:', error);
    next(error);
  }
}

module.exports = {
  getGroups,
  getVolume,
  setVolume
};
