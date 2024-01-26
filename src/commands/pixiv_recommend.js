const { SlashCommandBuilder } = require('discord.js');
const pixiv = require('../utils/pixiv.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('recommend')
        .setDescription('It will send a picture drawn by recommending artist form pixiv.'),

    async execute(interaction) {
        await pixiv.pixiv_recommend(interaction);
    }
    
} 