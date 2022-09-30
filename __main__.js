 const Discord = require("discord.js");
const colors = require("colors");
const enmap = require("enmap"); 
const fs = require("fs"); 

const Meme = require("memer-api");
require('dotenv').config();

const client = new Discord.Client({
  fetchAllMembers: false,
  restTimeOffset: 0,
  failIfNotExists: false,
  shards: "auto",
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
presence: {
    activities: [{name: `${config.status.text}`.replace("{prefix}", config.prefix), type: config.status.type, url: config.status.url}],
    status: "idle"
  }
});

client.memer = new Meme(process.env.memer_api); 


client.registry
	.registerDefaultTypes()
	.registerTypesIn(path.join(__dirname, 'types'))
	.registerGroups([
		['util-public', 'Utility'],
		['util', 'Utility (Owner)'],
		['info', 'Discord Information'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['random-seed', 'Seeded Randomizers'],
		['single', 'Single Response'],
		['auto', 'Automatic Response'],
		['events', 'Events'],
		['search', 'Search'],
		['analyze', 'Analyzers'],
		['games-sp', 'Single-Player Games'],
		['games-mp', 'Multi-Player Games'],
		['edit-image', 'Image Manipulation'],
		['edit-avatar', 'Avatar Manipulation'],
		['edit-meme', 'Meme Generators'],
		['edit-text', 'Text Manipulation'],
		['edit-number', 'Number Manipulation'],
		['voice', 'Voice-Based'],
		['phone', 'Phone'],
		['code', 'Coding Tools'],
		['other', 'Other'],
		['roleplay', 'Roleplay']
	])


	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const embed = new MessageEmbed()
			.setColor(0x7CFC00)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Joined ${guild.name}!`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount));
		await joinLeaveChannel.send({ embed });
	}
});

client.on('guildDelete', async guild => {
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const embed = new MessageEmbed()
			.setColor(0xFF0000)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Left ${guild.name}...`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount));
		await joinLeaveChannel.send({ embed });
	}
});

client.on('guildMemberRemove', async member => {
	if (member.id === client.user.id) return null;
	const channel = member.guild.systemChannel;
	if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;
	if (channel.topic && channel.topic.includes('<xiao:disable-leave>')) return null;
	try {
		const leaveMessage = client.leaveMessages[Math.floor(Math.random() * client.leaveMessages.length)];
		await channel.send(leaveMessage.replace(/{{user}}/gi, `**${member.user.tag}**`));
		return null;
	} catch {
		return null;
	}
});

client.on('disconnect', event => {
	client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
	client.exportCommandLeaderboard();
	process.exit(0);
});

client.on('error', err => client.logger.error(err.stack));

client.on('warn', warn => client.logger.warn(warn));

client.on('commandRun', command => {
	if (command.uses === undefined) return;
	command.uses++;
});

client.on('commandError', (command, err) => client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`));

client.login(process.env.token)
