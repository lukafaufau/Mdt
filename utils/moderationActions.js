const { RateLimiterMemory } = require('rate-limiter-flexible');

// Rate limiter for mute actions to prevent abuse
const muteLimiter = new RateLimiterMemory({
  points: 10, // Number of mutes
  duration: 60, // Per 1 minute
});

/**
 * Utility functions for moderation actions
 */

/**
 * Mute a user in the guild
 * @param {GuildMember} member - The member to mute
 * @param {number} duration - Mute duration in milliseconds
 * @returns {Promise<GuildMember>} - The muted member
 */
async function muteUser(member, duration) {
  try {
    // Check rate limit before muting
    await muteLimiter.consume(member.guild.id);
    
    // Timeout the member (Discord's built-in mute)
    return await member.timeout(duration, 'Anti-raid protection');
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      console.warn('Rate limit reached for mute actions in guild:', member.guild.id);
      return null;
    }
    console.error('Error muting user:', error);
    throw error;
  }
}

/**
 * Unmute a user in the guild
 * @param {GuildMember} member - The member to unmute
 * @returns {Promise<GuildMember>} - The unmuted member
 */
async function unmuteUser(member) {
  try {
    // Remove timeout from the member
    return await member.timeout(null, 'Manual unmute');
  } catch (error) {
    console.error('Error unmuting user:', error);
    throw error;
  }
}

module.exports = { muteUser, unmuteUser };