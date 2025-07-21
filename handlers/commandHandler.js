const config = require('../config/config');
const moderationActions = require('../utils/moderationActions');
const messageUtils = require('../utils/messageUtils');

/**
 * Check if a message is a command
 * @param {Message} message - The Discord message to check
 * @returns {boolean} - Whether the message is a command
 */
function isCommand(message) {
  return message.content.startsWith(config.commands.prefix);
}

/**
 * Handle a command message
 * @param {Message} message - The Discord message containing the command
 */
function handleCommand(message) {
  // Extract command and arguments
  const args = message.content.slice(config.commands.prefix.length).trim().split(/\s+/);
  const command = args.shift().toLowerCase();
  
  // Handle unmute command
  if (command === config.commands.unmuteCommand) {
    handleUnmuteCommand(message, args);
  }
}

/**
 * Handle the unmute command
 * @param {Message} message - The Discord message containing the command
 * @param {string[]} args - Command arguments
 */
function handleUnmuteCommand(message, args) {
  // Check if user has permission to unmute
  if (!message.member.permissions.has('MODERATE_MEMBERS')) {
    message.reply('You do not have permission to use this command.');
    return;
  }
  
  // Get the target user
  const targetUser = message.mentions.members.first();
  if (!targetUser) {
    message.reply('Please mention a user to unmute.');
    return;
  }
  
  // Unmute the user
  moderationActions.unmuteUser(targetUser)
    .then(() => {
      message.reply(`Successfully unmuted ${targetUser.user.tag}.`);
      
      // Send notification to mod log
      messageUtils.sendUnmuteAlert(
        message.client,
        targetUser.user,
        message.author
      );
    })
    .catch(error => {
      console.error('Error unmuting user:', error);
      message.reply('Failed to unmute the user. Please check the logs for details.');
    });
}

module.exports = { isCommand, handleCommand };