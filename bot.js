let data = require('./data.json');
let secrets = require('./secrets.json');
const Discord = require('discord.js');

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

let token = "";
let prefix = ["!", "`!"];

let log_in = "919070736864383016";

let commands = {
    "toag": {
        "desc": "TOAG",
        "f": function(msg, args) {
            msg.channel.send("TOAG");
        }
    }, 
    
    "help": {
        "desc": "Shows a list of all commands",
        "f": function(msg, args) {
            let limit = 5;
            let width = 40;

            if (args.length == 1) {
                let cmds = [];
                for (let command in commands) {
                    cmds.push([command, commands[command].desc]);
                }

                let out = "Type `help <command>` for help on a specific command\n```\n";
                cmds.forEach(cmd => {
                    let line = `${cmd[0]}: ${cmd[1]}`;
                    if (line.length > width) {
                        line = line.substring(0, width-3);
                        line += "...";
                    }
                    out += line + "\n";
                });
                out += "```";

                msg.channel.send(out);
            } else {
                if (commands[args[1]] == undefined) {
                    msg.channel.send("That's not a command you doink");
                    return;
                }
                msg.channel.send(`\`\`\`${args[1]}: ${commands[args[1]].desc}\n\`\`\``)
            }
        }
    },
    
    "error": {
        "desc": "Raises an error to test the bot's error handling.",
        "f": function(msg, args) {
            throw "error test";
        }
    },

    "say": {
        "desc": "Say something (this only works in the testing server don't @ me)",
        "f": function(msg, args) {
            if (args[1] === undefined) return;

            if (msg.guild.id === "919070736864383016") {
                if (args[1].indexOf("@everyone") != -1 ||
                    args[1].indexOf("@here")     != -1 ||
                    /<@\d+>/g.test(args[1])            ||
                    /<@!\d+>/g.test(args[1])           ||
                    /<@&\d+>/g.test(args[1]))
                    msg.channel.send(`I am going to castrate you, <@${msg.author.id}>.`)
                else msg.channel.send(args[1]);
                msg.delete();
            } else {
                msg.channel.send("go to ~~brazil~~ the testing server.")
            }
        }
    },

    "code": {
        "desc": "Shows source code of bot",
        "f": function(msg, args) {
            msg.channel.send("<:quagheart:919110422873915422> Hiya! Thanks for checking out the source code!! Here's the link:\n    <https://github.com/tobifx0/safety-quag-2.0>");
        }
    }
}

function modlog(type, user, text, attachments) {
    client.channels.cache.get("919075525404790795").send(
        { 
            "embeds": [{
                "type": "rich",
                "title": `${user.tag} (${user.id})`,
                "description": text,
                "color": 0xd186d0,
                "author": {
                    "name": type
                },
                "thumbnail": {
                    "url": attachments.first() !== undefined ? attachments.first().url : "",
                    "height": 0,
                    "width": 0
                }
            }]
        }
    );
}

client.on('messageCreate', message => {
    data.scamlinks.forEach(link => {
        if (message.content.includes(link)) {
            message.delete();
            return;
        }
    });
    
    if (message.content.indexOf("<@!776707837635985418>") != -1 ||
        message.content.indexOf("<@776707837635985418>") != -1) {
        console.log("fuck");
        message.react("<:ping:919094079302799373>")
    }

    if (message.author.bot) return;
    if (!message.content.startsWith("!")) return;

    let content = message.content.substring(1, message.content.length);
    let args = [];
    let i = 0;
    let t = "";
    let s = true;
    while (i < content.length) {
        let c = content[i];
        if (c == " " && s) {
            args.push(t);
            t = "";
        } else if (c == "\"" || c == "”" && s) {
            s = !s;
        } else {
            if (c != "\"" && c != "”") t += c;
        }

        i++;
    }
    if (t != "") args.push(t);

    console.log(args);
    if (commands[args[0]] == undefined) {
        message.channel.send("That's not a command you doink");
        return;
    }

    try {
    commands[args[0]].f(message, args);
    } catch (e) {
        message.channel.send(`oh god something broke: <:quagfire:919088700678373386>\n\`\`\`diff\n+ Unhandled exception while executing “${args[0]}”: \n-    ${e.toString().replace(/\n/g, "\n- ")}\`\`\`\n ${args[0] != "error" ? "<:madsire:919091868439040021> <@908547025824518155> pls fix" : ""}`)
    }
});

client.on('messageDelete', message => {
    if (message.guild.id != log_in) return;
    modlog(`Deleted Message in #${message.channel.name}`, message.author, message.content, message.attachments);
    client.channels.cache.get("919075525404790795")
});
client.on('messageUpdate', (oldmessage, newmessage) => {
    if (newmessage.guild.id != log_in) return;
    modlog("Edited Message", newmessage.author, `${oldmessage.content}\t**→**\t${newmessage.content}`, newmessage.attachments);

    
    data.scamlinks.forEach(link => {
        if (newmessage.content.includes(link)) {
            newmessage.delete();
            return;
        }
    });
});

client.login(secrets.token);
