const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

// Lazy initialization of key to handle missing ENCRYPTION_KEY gracefully
let key = null;

function getKey() {
  if (!key) {
    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY environment variable is not set');
    }
    key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    if (key.length !== 32) {
      throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)');
    }
  }
  return key;
}

const ivLength = 16;

function encrypt(text) {
  const currentKey = getKey();
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv(algorithm, currentKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  const currentKey = getKey();
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(algorithm, currentKey, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
