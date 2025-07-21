// Default configuration values
const config = {
  // Raid detection thresholds
  messageThresholds: {
    count: 5,         // Number of messages
    timeWindow: 3000, // Time window in milliseconds (3 seconds)
    mentionLimit: 3,  // Max mentions per message before flagging
    emojiLimit: 10,   // Max emojis per message before flagging
    linkLimit: 2      // Max links per message before flagging
  },
  
  // Member join raid detection
  joinThresholds: {
    count: 5,         // Number of new members
    timeWindow: 10000 // Time window in milliseconds (10 seconds)
  },
  
  // Auto-moderation settings
  moderation: {
    deleteMutedMessages: true, // Whether to delete messages from muted users
    messageDeleteCount: 10,    // How many messages to delete when raid detected
    muteDuration: 300000       // Mute duration in milliseconds (5 minutes)
  },
  
  // Embed settings
  embed: {
    color: 0x00BFFF,    // Light blue color
    authorName: "Reload" // Author name for all embeds
  },
  
  // Command settings
  commands: {
    prefix: '!',          // Command prefix
    unmuteCommand: 'unmute' // Command to unmute users
  },
  
  // Admin IDs (populated from .env)
  adminIds: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [],
  
  // Mod log channel ID (from .env)
  modLogChannelId: process.env.MOD_LOG_CHANNEL_ID
};

module.exports = config;