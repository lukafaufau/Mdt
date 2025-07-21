const { Collection } = require('discord.js');
const config = require('../config/config');
const moderationActions = require('../utils/moderationActions');
const messageUtils = require('../utils/messageUtils');

// Cache for tracking recent member joins
const recentJoins = [];

/**
 * Process a new member join to check for raid behavior
 * @param {GuildMember} member - The Discord guild member who joined
 */
function processMemberJoin(member) {
  const currentTime = Date.now();
  
  // Add the current join to the history
  recentJoins.push({
    memberId: member.id,
    timestamp: currentTime
  });
  
  // Remove joins outside the time window
  const timeWindow = config.joinThresholds.timeWindow;
  const relevantJoins = recentJoins.filter(join => 
    currentTime - join.timestamp < timeWindow
  );
  
  // Update the cache with only the relevant joins
  while (recentJoins.length > 0) {
    recentJoins.shift();
  }
  relevantJoins.forEach(join => recentJoins.push(join));
  
  // Check if the number of joins exceeds the threshold
  if (relevantJoins.length >= config.joinThresholds.count) {
    handleMemberRaidDetection(member);
  }
}

/**
 * Handle a detected member join raid
 * @param {GuildMember} member - The member that triggered the detection
 */
function handleMemberRaidDetection(member) {
  // Take moderation actions
  moderationActions.muteUser(member, config.moderation.muteDuration);
  
  // Send notification to mod log
  messageUtils.sendMemberRaidAlert(
    member.client,
    member.user,
    recentJoins.length,
    config.joinThresholds.timeWindow / 1000
  );
}

module.exports = { processMemberJoin };