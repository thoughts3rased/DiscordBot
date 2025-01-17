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

    //Fetch the GUID from the command
    const guid = interaction.options.getString('server')

    //Check if the gui is valid (-1 is used for errors)
    if (guid == "-1"){
        interaction.reply({content: "Unable to connect to MCSS", ephemeral: true});
    }else{
        var data = await MCSS.getServer(guid);

        if(data == null){
            interaction.respond({content: "Unable to connect to MCSS", ephemeral: true});
        }else{

            //Resolve some varibles to useable values
            var status = await MCSS.resolveStatus(data.Status)
            var keepOnline = await MCSS.resolveKeepOnline(data.KeepOnline)

            //Create the embed
            var embed = new MessageEmbed()
            .setTitle(data.Name)
            .setColor(0x00AE86)
            .setDescription(`
            **Guid**: \`${data.Guid}\`
            **Status**: ${status.Emoji}
            **Description**: \`${data.Description}\`
            **Path To Folder**: \`${data.PathToFolder}\`
            **Folder Name**: \`${data.FolderName}\`
            **Creation Date**: \`${data.CreationDate}\`
            **Auto Start?**: \`${data.IsSetToAutoStart}\`
            **Keep Online?**: \`${keepOnline}\`
            **Allocated Memory**: \`${data.JavaAllocatedMemory}\`
            **Startup Line**: \`${data.JavaStartupLine}\`
            `)

            interaction.reply({embeds: [embed]});
        }
    }
}

module.exports.autocomplete = async(interaction, Config, Client) => {
    //Fetch minimal server info for auto complete
    var data = await MCSS.getServersMinimal();
    if(data == null){
        //Api is unreachable
        interaction.respond([{name: "Unable to connect to MCSS", value: "-1"}]);
    }else{
        var servers = [];
        var value = interaction.options.getFocused(true);
        //Perform a narrow down search on the servers to only get the ones that match the search
        await data.forEach(async (server) => {
            if(server.Name.toLowerCase().includes(value.value.toLowerCase()) || value == ""){
                servers.push({name: server.Name, value: server.Guid});
            }
        });
        //Give the options back to discord
        interaction.respond(servers);
    }
}

module.exports.info = new SlashCommandBuilder()
    .setName('server')
    .setDefaultPermission(false)
    .setDescription('Get more detailed info on a specific server')
    .addStringOption(option => 
        option.setName('server')
        .setDescription('The server to get info on')
        .setRequired(true)
    );

//Temp while i wait for builder update
module.exports.extraJSON = {
    options: [
        {
            type: 3,
            name: 'server',
            description: 'The server to get info on',
            required: true,
            autocomplete: true
        }
    ]
}