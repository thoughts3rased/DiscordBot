/*
 * ====================NOTE====================
 *    This code was created by LostAndDead,
 *   please don't claim this as your own work
 *        https://github.com/LostAndDead
 * ============================================
 */

const { SlashCommandBuilder} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const MCSS = require('../utils/MCSS API');

module.exports.run = async(interaction, Config, Client) => {
    const guid = interaction.options.getString('server')

    if (guid == "-1"){
        interaction.reply({content: "Unable to connect to MCSS", ephemeral: true});
    }else{
        var data = await MCSS.getServer(guid);
        if(data.Status == 0){
            await MCSS.executeAction(guid, 1);
            interaction.reply({content: "Sent start request to server.", ephemeral: true});
        }else if (data == null){
            interaction.respond({content: "Unable to connect to MCSS", ephemeral: true});
        }else{
            interaction.reply({content: "Server is not offline therefore can not be started", ephemeral: true});
        }
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    var data = await MCSS.getServersMinimal();

    if(data == null){
        interaction.respond([{name: "Unable to connect to MCSS", value: "-1"}]);
    }else{
        var servers = [];
        var value = interaction.options.getFocused(true);
        await data.forEach(async (server) => {
            if(server.Name.toLowerCase().includes(value.value.toLowerCase()) || value == ""){
                servers.push({name: server.Name, value: server.Guid});
            }
        });
        interaction.respond(servers);
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    var data = await MCSS.getServersMinimal();

    if(data == null){
        interaction.respond([{name: "Unable to connect to MCSS", value: "-1"}]);
    }else{
        var servers = [];
        var value = interaction.options.getFocused(true);
        await data.forEach(async (server) => {
            if(server.Name.toLowerCase().includes(value.value.toLowerCase()) || value == ""){
                servers.push({name: server.Name, value: server.Guid});
            }
        });
        interaction.respond(servers);
    }
}

module.exports.info = new SlashCommandBuilder()
    .setName('start')
    .setDefaultPermission(false)
    .setDescription('Start a server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to start')
        .setRequired(true)
    );

module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to start',
            required: true,
            autocomplete: true
        }
    ]
}