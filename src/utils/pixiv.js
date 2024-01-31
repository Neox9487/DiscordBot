const { PythonShell } = require('python-shell');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { data } = require('../commands/pixiv_addUser');

class Pixiv{
    
    async pixiv_recommend(interaction){

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});
        console.log(interaction.user.username+" used command 'recommend'.");

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './src/commands/python',
        };

        let json = null;
        let pyshell = new PythonShell('pixiv_recommend.py',options);
        const image_path = "./src/assets/images/";

        pyshell.send(null);
        pyshell.on('message', function (message) {
            json = JSON.parse(message);
        });
        pyshell.end(function (err,data) {

            if (err) throw err;
            let file = new AttachmentBuilder(image_path+`${json['png_id']}.png`);

            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setURL(`https://www.pixiv.net/artworks/${json["png_id"]}`)
                .setTitle(json["title"])
                .setDescription(json["description"])
                .setImage(`attachment://${json["png_id"]}.png`)
                .setFooter({text:`ID : ${json["png_id"]}`});
                
            interaction.deleteReply();
            interaction.followUp({ embeds: [embed], files: [file]});

          });

        return;

    }
    
    async pixiv_tagSearching(interaction){

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});
        console.log(interaction.user.username+" used command 'tag'.");

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './src/commands/python',
        }

        let tag = interaction.options.getString('tag').trim();
        let json = null;
        
        let pyshell = new PythonShell('pixiv_tagSearching.py',options);
        const image_path = "./src/assets/images/";

        pyshell.send(String(tag));
        pyshell.on('message', function (message){
            json = JSON.parse(message);
        });
        pyshell.end(function (err,data) {

            if (err) throw err;
            let file = new AttachmentBuilder(image_path+`${json['png_id']}.png`);

            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setURL(`https://www.pixiv.net/artworks/${json["png_id"]}`)
                .setTitle(json["title"])
                .setDescription(json["description"])
                .setImage(`attachment://${json["png_id"]}.png`)
                .setFooter({text:`ID : ${json["png_id"]}`});
                
            interaction.deleteReply();
            interaction.followUp({ embeds: [embed], files: [file]});

        });
        
        return;

    }

    async pixiv_addUser(interaction){

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});
        console.log(interaction.user.username+" used command 'add_user'.");

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './src/commands/python',
        }

        let painterID = interaction.options.getString('id').trim();
        let pyshell = new PythonShell('pixiv_addUser.py',options);

        let finish = null;

        let obj = [String(painterID),interaction.user.id]

        pyshell.send(JSON.stringify(obj))
        pyshell.on('message', function (message){
            console.log(message)
            finish = (message == "finish" ? true : false)
        });
        pyshell.end(function (err,data) {

            if (err) throw err;

            if (finish) {
                interaction.deleteReply();
                interaction.followUp("Finished!");
            }

            else {
                interaction.deleteReply();
                interaction.followUp("This pixiv user ID is not exist!");
            }
            
        });
        
        return;

    }

    async pixiv_addUser(interaction){

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});
        console.log(interaction.user.username+" used command 'add_user'.");

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './src/commands/python',
        }

        let painterID = interaction.options.getString('id').trim();
        let pyshell = new PythonShell('pixiv_addUser.py',options);

        let finish = null;

        let obj = [String(painterID),interaction.user.id]

        pyshell.send(JSON.stringify(obj))
        pyshell.on('message', function (message){
            console.log(message)
            finish = (message == "finish" ? true : false)
        });
        pyshell.end(function (err,data) {

            if (err) throw err;

            if (finish) {
                interaction.deleteReply();
                interaction.followUp("Finished!");
            }

            else {
                interaction.deleteReply();
                interaction.followUp("This pixiv user ID is not exist!");
            }
            
        });
        
        return;

    }

}

module.exports = new Pixiv();