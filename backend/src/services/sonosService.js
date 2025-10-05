const axios = require('axios');
const { Token } = require('../models');
const { encrypt, decrypt } = require('../config/encryption');

class SonosService {
  constructor(userId) {
    this.userId = userId;
  }
  
  /**
   * Get a valid access token, refreshing if necessary
   */
  async getValidAccessToken() {
    const tokenRecord = await Token.findOne({ 
      where: { userId: this.userId } 
    });
    
    if (!tokenRecord) {
      throw new Error('No Sonos tokens found for user. Please re-authenticate.');
    }
    
    // Check if token expires in less than 5 minutes
    const fiveMinutes = 5 * 60 * 1000;
    const expiresAt = new Date(tokenRecord.expiresAt).getTime();
    
    if (Date.now() > (expiresAt - fiveMinutes)) {
      console.log('Access token expiring soon, refreshing...');
      const newTokens = await this.refreshAccessToken(
        decrypt(tokenRecord.refreshToken)
      );
      await this.updateTokens(newTokens);
      return newTokens.access_token;
    }
    
    return decrypt(tokenRecord.accessToken);
  }
  
  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(refreshToken) {
    const credentials = Buffer.from(
      `${process.env.SONOS_CLIENT_ID}:${process.env.SONOS_CLIENT_SECRET}`
    ).toString('base64');
    
    try {
      const response = await axios.post(
        'https://api.sonos.com/login/v3/oauth/access',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${credentials}`
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      throw new Error('Failed to refresh Sonos token. User needs to re-authenticate.');
    }
  }
  
  /**
   * Update stored tokens in database
   */
  async updateTokens(tokenData) {
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    
    await Token.update(
      {
        accessToken: encrypt(tokenData.access_token),
        refreshToken: encrypt(tokenData.refresh_token),
        expiresAt: expiresAt,
        tokenType: tokenData.token_type,
        scope: tokenData.scope
      },
      {
        where: { userId: this.userId }
      }
    );
  }
  
  /**
   * Make an authenticated request to Sonos API
   */
  async makeRequest(method, endpoint, data = null) {
    const accessToken = await this.getValidAccessToken();
    
    const config = {
      method,
      url: `https://api.ws.sonos.com/control/api/v1${endpoint}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      // If we get 401, try refreshing token once more
      if (error.response?.status === 401) {
        console.log('Got 401, forcing token refresh...');
        const tokenRecord = await Token.findOne({ 
          where: { userId: this.userId } 
        });
        const newTokens = await this.refreshAccessToken(
          decrypt(tokenRecord.refreshToken)
        );
        await this.updateTokens(newTokens);
        
        // Retry request with new token
        config.headers.Authorization = `Bearer ${newTokens.access_token}`;
        const retryResponse = await axios(config);
        return retryResponse.data;
      }
      
      throw error;
    }
  }
  
  // ===== Sonos API Methods =====
  
  /**
   * Get user's households
   */
  async getHouseholds() {
    return this.makeRequest('GET', '/households');
  }
  
  /**
   * Get groups (devices) in a household
   */
  async getGroups(householdId) {
    return this.makeRequest('GET', `/households/${householdId}/groups`);
  }
  
  /**
   * Get music services for a household
   */
  async getMusicServices(householdId) {
    return this.makeRequest('GET', `/households/${householdId}/musicServices`);
  }
  
  /**
   * Set volume for a group
   * @param {string} groupId - The group ID
   * @param {object} volumeData - { volume: 50 } or { volumeDelta: -5 } or { muted: true }
   */
  async setVolume(groupId, volumeData) {
    return this.makeRequest('POST', `/groups/${groupId}/groupVolume`, volumeData);
  }
  
  /**
   * Get current volume for a group
   */
  async getVolume(groupId) {
    return this.makeRequest('GET', `/groups/${groupId}/groupVolume`);
  }
}

module.exports = SonosService;
