const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

/**
 * Delete recent messages from a user in a channel
 * @param {TextChannel} channel - The channel to delete messages from
 * @param {string} userId - The ID of the user whose messages to delete
 * @param {number} count - The number of messages to attempt to delete
 */
async function deleteRecentMessages(channel, userId, count) {
  try {
    // Fetch recent messages
    const messages = await channel.messages.fetch({ limit: 50 });
    
    // Filter messages by the specified user
    const userMessages = messages.filter(msg => msg.author.id === userId);
    
    // Delete up to the specified count of messages
    const messagesToDelete = userMessages.first(count);
    
    // Bulk delete if possible, otherwise delete individually
    if (messagesToDelete.length > 1) {
      await channel.bulkDelete(messagesToDelete);
    } else {
      for (const message of messagesToDelete) {
        await message.delete().catch(() => {});
      }
    }
  } catch (error) {
    console.error('Error deleting messages:', error);
  }
}

/**
 * Send a raid alert to the mod log channel
 * @param {Client} client - Discord client
 * @param {User} user - The user who triggered the raid detection
 * @param {string} reason - The reason for the detection
 * @param {string} channelName - The channel where the raid was detected
 */
function sendRaidAlert(client, user, reason, channelName) {
  const modLogChannel = client.channels.cache.get(config.modLogChannelId);
  if (!modLogChannel) return;
  
  const embed = new EmbedBuilder()
    .setColor(config.embed.color)
    .setAuthor({ name: config.embed.authorName })
    .setTitle('Raid Detected')
    .setDescription(`User ${user.tag} (${user.id}) has been muted for ${reason}.`)
    .addFields(
      { name: 'Channel', value: `#${channelName}`, inline: true },
      { name: 'Action Taken', value: 'User Muted', inline: true },
      { name: 'Duration', value: `${config.moderation.muteDuration / 60000} minutes`, inline: true }
    )
    .setTimestamp();
  
  modLogChannel.send({ embeds: [embed] });
}

/**
 * Send a member raid alert to the mod log channel
 * @param {Client} client - Discord client
 * @param {User} user - The user who triggered the raid detection
 * @param {number} joinCount - The number of recent joins
 * @param {number} timeWindow - The time window in seconds
 */
function sendMemberRaidAlert(client, user, joinCount, timeWindow) {
  const modLogChannel = client.channels.cache.get(config.modLogChannelId);
  if (!modLogChannel) return;
  
  const embed = new EmbedBuilder()
    .setColor(config.embed.color)
    .setAuthor({ name: config.embed.authorName })
    .setTitle('Member Raid Detected')
    .setDescription(`Suspicious join activity detected: ${joinCount} joins in ${timeWindow} seconds.`)
    .addFields(
      { name: 'Latest Join', value: `${user.tag} (${user.id})`, inline: true },
      { name: 'Action Taken', value: 'User Muted', inline: true },
      { name: 'Duration', value: `${config.moderation.muteDuration / 60000} minutes`, inline: true }
    )
    .setTimestamp();
  
  modLogChannel.send({ embeds: [embed] });
}

/**
 * Send an unmute alert to the mod log channel
 * @param {Client} client - Discord client
 * @param {User} user - The user who was unmuted
 * @param {User} moderator - The moderator who performed the unmute
 */
function sendUnmuteAlert(client, user, moderator) {
  const modLogChannel = client.channels.cache.get(config.modLogChannelId);
  if (!modLogChannel) return;
  
  const embed = new EmbedBuilder()
    .setColor(config.embed.color)
    .setAuthor({ name: config.embed.authorName })
    .setTitle('User Unmuted')
    .setDescription(`User ${user.tag} (${user.id}) has been manually unmuted.`)
    .addFields(
      { name: 'Moderator', value: `${moderator.tag} (${moderator.id})`, inline: true },
      { name: 'Action', value: 'Manual Unmute', inline: true }
    )
    .setTimestamp();
  
  modLogChannel.send({ embeds: [embed] });
}

module.exports = {
  deleteRecentMessages,
  sendRaidAlert,
  sendMemberRaidAlert,
  sendUnmuteAlert
};