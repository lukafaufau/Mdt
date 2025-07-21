const { Collection } = require('discord.js');
const config = require('../config/config');
const moderationActions = require('../utils/moderationActions');
const messageUtils = require('../utils/messageUtils');

// Cache for tracking recent messages
const userMessageCache = new Collection();

/**
 * Process a new message to check for raid behavior
 * @param {Message} message - The Discord message to process
 */
function processMessage(message) {
  // Skip processing for whitelisted admins
  if (config.adminIds.includes(message.author.id)) {
    return;
  }
  
  // Check for message spam (multiple messages in short time)
  const isMessageSpam = checkMessageSpam(message);
  
  // Check for content spam (mentions, emojis, links)
  const isContentSpam = checkContentSpam(message);
  
  // If either type of spam is detected, take action
  if (isMessageSpam || isContentSpam) {
    handleRaidDetection(message, isMessageSpam ? 'message spam' : 'content spam');
  }
}

/**
 * Check if a user is sending too many messages in a short time
 * @param {Message} message - The Discord message to check
 * @returns {boolean} - Whether message spam was detected
 */
function checkMessageSpam(message) {
  const userId = message.author.id;
  const currentTime = Date.now();
  
  // Initialize this user's message history if it doesn't exist
  if (!userMessageCache.has(userId)) {
    userMessageCache.set(userId, []);
  }
  
  const userMessages = userMessageCache.get(userId);
  
  // Add the current message timestamp to the user's history
  userMessages.push(currentTime);
  
  // Remove messages outside the time window
  const timeWindow = config.messageThresholds.timeWindow;
  const relevantMessages = userMessages.filter(timestamp => 
    currentTime - timestamp < timeWindow
  );
  
  // Update the cache with only the relevant messages
  userMessageCache.set(userId, relevantMessages);
  
  // Check if the number of messages exceeds the threshold
  return relevantMessages.length >= config.messageThresholds.count;
}

/**
 * Check message content for spam patterns (mentions, emojis, links)
 * @param {Message} message - The Discord message to check
 * @returns {boolean} - Whether content spam was detected
 */
function checkContentSpam(message) {
  const content = message.content;
  
  // Check for excessive mentions
  const mentionCount = (content.match(/<@!?\d+>/g) || []).length;
  if (mentionCount > config.messageThresholds.mentionLimit) {
    return true;
  }
  
  // Check for excessive emojis
  const emojiCount = (content.match(/<a?:\w+:\d+>/g) || []).length;
  if (emojiCount > config.messageThresholds.emojiLimit) {
    return true;
  }
  
  // Check for excessive links
  const linkCount = (content.match(/https?:\/\/\S+/g) || []).length;
  if (linkCount > config.messageThresholds.linkLimit) {
    return true;
  }
  
  return false;
}

/**
 * Handle a detected raid
 * @param {Message} message - The message that triggered the detection
 * @param {string} reason - The reason for the detection
 */
function handleRaidDetection(message, reason) {
  // Take moderation actions
  moderationActions.muteUser(message.member, config.moderation.muteDuration);
  
  // Delete recent messages if configured
  if (config.moderation.deleteMutedMessages) {
    messageUtils.deleteRecentMessages(
      message.channel, 
      message.author.id, 
      config.moderation.messageDeleteCount
    );
  }
  
  // Send notification to mod log
  messageUtils.sendRaidAlert(
    message.client,
    message.author,
    reason,
    message.channel.name
  );
}

module.exports = { processMessage };