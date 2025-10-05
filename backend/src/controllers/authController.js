const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User, Token } = require('../models');
const { encrypt } = require('../config/encryption');

/**
 * Generate authorization URL for Sonos OAuth
 */
function getAuthorizationUrl(req, res) {
  const authUrl = new URL('https://api.sonos.com/login/v3/oauth');
  authUrl.searchParams.append('client_id', process.env.SONOS_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', process.env.SONOS_REDIRECT_URI);
  authUrl.searchParams.append('scope', 'playback-control-all');
  authUrl.searchParams.append('state', generateRandomState());
  
  res.redirect(authUrl.toString());
}

/**
 * Handle OAuth callback from Sonos
 */
async function handleCallback(req, res) {
  const { code, state, error } = req.query;
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return res.redirect(`${process.env.FRONTEND_URL}?error=${error}`);
  }
  
  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);
  }
  
  try {
    // Exchange authorization code for tokens
    const tokenData = await exchangeCodeForTokens(code);
    
    // Get user info from Sonos (or create placeholder)
    // Note: Sonos doesn't provide a user info endpoint, so we use a placeholder
    const sonosUserId = `sonos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Find or create user
    let user = await User.findOne({ where: { sonosUserId } });
    
    if (!user) {
      user = await User.create({
        sonosUserId,
        lastLogin: new Date()
      });
    } else {
      await user.update({ lastLogin: new Date() });
    }
    
    // Store Sonos tokens (encrypted)
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    
    await Token.upsert({
      userId: user.id,
      accessToken: encrypt(tokenData.access_token),
      refreshToken: encrypt(tokenData.refresh_token),
      expiresAt,
      tokenType: tokenData.token_type,
      scope: tokenData.scope
    });
    
    // Generate JWT for our API
    const jwtToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Redirect to frontend with JWT
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${jwtToken}`);
    
  } catch (error) {
    console.error('Callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
  }
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForTokens(authCode) {
  const credentials = Buffer.from(
    `${process.env.SONOS_CLIENT_ID}:${process.env.SONOS_CLIENT_SECRET}`
  ).toString('base64');
  
  try {
    const response = await axios.post(
      'https://api.sonos.com/login/v3/oauth/access',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: process.env.SONOS_REDIRECT_URI
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
    console.error('Token exchange failed:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code for tokens');
  }
}

/**
 * Logout user
 */
async function logout(req, res) {
  try {
    // Optionally delete tokens from database
    // await Token.destroy({ where: { userId: req.userId } });
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'LOGOUT_ERROR', message: error.message }
    });
  }
}

/**
 * Get current user info
 */
async function getCurrentUser(req, res) {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ['id', 'email', 'sonosUserId', 'lastLogin']
    });
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { code: 'USER_FETCH_ERROR', message: error.message }
    });
  }
}

/**
 * Generate random state for OAuth
 */
function generateRandomState() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

module.exports = {
  getAuthorizationUrl,
  handleCallback,
  logout,
  getCurrentUser
};
