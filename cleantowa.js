
// created 10/19/2020


// CONSTANTS -------------------------------------------------
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const { createPrivateKey } = require('crypto');
const Discord = require('discord.js');
const client = new Discord.Client();

var fs = require("fs");
const { networkInterfaces } = require('os');
const { disconnect } = require('process');
const internal = require('stream');

// JSON COLLECTIONS -------------------------------------------

let serverList = fs.readFileSync("serverList.json");
let jsonServerList = JSON.parse(serverList);
var serverDict = [];

for (i in jsonServerList)
{
    serverDict.push(jsonServerList[i])
}

let userList = fs.readFileSync("userList.json");
let jsonList = JSON.parse(userList);
var userDict = [];

for (var i in jsonList)
{
    userDict.push(jsonList[i]);
}

let shopList = fs.readFileSync("shopList.json");
let jsonShopList = JSON.parse(shopList);
var shopDict = [];

for (var i in jsonShopList)
{
    shopDict.push(jsonShopList[i])
}

let blacklist = fs.readFileSync("blacklist.json");
let blacklistList = JSON.parse(blacklist);
var blacklistDict = [];

for (var i in blacklistList)
{
    blacklistDict.push(blacklistList[i])
}

let schedules = fs.readFileSync("schedules.json");
let schedulesList = JSON.parse(schedules);
var schedulesDict = [];

for (var i in schedulesList)
{
    schedulesDict.push(schedulesList[i])
}

let universes = fs.readFileSync("universeslist.json");
let uniLists = JSON.parse(universes);
var uniDict = [];

for (var i in uniLists)
{
    uniDict.push(uniLists[i])
}

let speciesrole = fs.readFileSync("uniroles.json");
let specieslist = JSON.parse(speciesrole);
var speciesDict = [];

for (var i in specieslist)
{
    speciesDict.push(specieslist[i])
}

let logs = fs.readFileSync("logs.json");
let logsList = JSON.parse(logs);
var logsDict = [];

for (var i in logsList)
{
    logsDict.push(logsList[i])
}

let birthrole = fs.readFileSync("birthroles.json");
let birthlist = JSON.parse(birthrole);
var birthDict = [];

for (var i in birthlist)
{
    birthDict.push(birthlist[i])
}

let banned = fs.readFileSync("banlist.json");
let banList = JSON.parse(banned);
var banDict = [];

for (var i in banList)
{
    banDict.push(banList[i])
}

let blurb = fs.readFileSync("blurbs.json");
let blurbList = JSON.parse(blurb);
var blurbDict = [];

for (var i in blurbList)
{
    blurbDict.push(blurbList[i])
}

let memu = fs.readFileSync("memunilist.json");
let memuList = JSON.parse(memu);
var memuDict = [];

for (var i in memuList)
{
    memuDict.push(memuList[i])
}

let towauni = fs.readFileSync("towaunilist.json");
let towauniList = JSON.parse(towauni);
var universeDict = [];

for (var i in towauniList)
{
    universeDict.push(towauniList[i])
}

// CONSOLE LOGS -----------------------------------------------

client.once('ready', () => {
    console.log("Towa is ready to serve.");
    client.user.setPresence({
        status: "idle",
        activity: {
            name: "to nothing in particular | !help a",
            type: "LISTENING"
        }
    })
});

// MAIN LOOP --------------------------------------------------

client.on('message', msg => 
{
    // NEW SERVER ENTRY
    var createServer = true;
    var serverNum = 0;

    var userNum = 0;


    // DM MESSAGES ------------------------------------------

    if (msg.author.bot) return;
    if (msg.channel.type === 'dm') return;

    if (banDict.includes(msg.author.id)) return;

    let newServer = msg.guild.id;

    if (createServer)
    {
        for (i = 0; i < serverDict.length; i++)
        {
            if (serverDict[i].name === newServer)
            {
                serverNum = i;
                createServer = false;
            }
        }

    }

    if (createServer)
    {
        var obj = {
            name: newServer,
            prefix: "!",
            shopOn: true,
            currencyOn: true,
            moderationOn: true,
            suggestionsOn: true,
            logsOn: false,
            shopCreated: false,
            embedList: [],
            shopNumRoles: 0,
            currencyIcon: "$",
            currencyFlatRate: 3,
            currencyRandom: false,
            currencyBottomRate: 1,
            currencyTopRate: 3,
            jailChannel: null,
            jailRole: null,
            adminRoles: [],
            modRoles: [],
            askChannel: null,
            uniToggle: null,
            logChannel: null,
            bonusCurrRole: [],
            bonusCurrChannel: [],
            bannedChannel: []
        };

        serverDict.push(obj);
        serverNum = serverDict.length - 1;

        createServer = false;
    }

    var currGuild = serverDict[serverNum];

    // NEW USER ENTRY
    
    var createUser = true;

    let newUser = msg.guild.member(msg.author.id)

    // NEW LOGS ENTRY

    var createLogs = true;
    var logLoc = 0;

    if (createLogs)
    {
        for (i = 0; i < logsDict.length; i++)
        {
            if (logsDict[i].guild == currGuild.name)
            {
                logLoc = i;
                createLogs = false;
                break;
            }
        }
    }

    if (createLogs)
    {
        var obj = {guild: currGuild.name, contents: []}
        logsDict.push(obj);

        createLogs = false;
    }

    // CURRENCY CONTROL

    for (i = 0; i < userDict.length; i++)
    {
        if (userDict[i].name === newUser.id.toString() && userDict[i].guild == newServer)
        {
            if (currGuild.currencyOn)
            {
                if (currGuild.bonusCurrRole.length == 0 && currGuild.bonusCurrChannel.length == 0)
                {
                    if (currGuild.currencyRandom)
                    {
                        currRandVal = Math.floor(Math.random() * (currGuild.currencyTopRate - currGuild.currencyBottomRate)) + currGuild.currencyBottomRate;
                        userDict[i].currency += currRandVal;
                    }
                    
                    else
                    {
                        userDict[i].currency += currGuild.currencyFlatRate;
                    }
                }

                else
                {
                    for (k = 0; k < currGuild.bonusCurrRole.length; k++)
                    {
                        const found = msg.guild.member(msg.author).roles.cache.array().includes(msg.guild.roles.cache.get(currGuild.bonusCurrRole[k].role))       
                        if (currGuild.currencyRandom)
                        {
                            if (found)
                            {
                                currRandVal = Math.floor(Math.random() * (currGuild.currencyTopRate - currGuild.currencyBottomRate)) + currGuild.currencyBottomRate;
                                userDict[i].currency += (currGuild.bonusCurrRole[k].bonus * currRandVal);
                            }
                            else
                            {
                                currRandVal = Math.floor(Math.random() * (currGuild.currencyTopRate - currGuild.currencyBottomRate)) + currGuild.currencyBottomRate;
                                userDict[i].currency += currRandVal;
                            }
                        }

                        else
                        {
                            if (found)
                            {
                                userDict[i].currency += (currGuild.bonusCurrRole[k].bonus * currGuild.currencyFlatRate);
                            }
                            else
                            {
                                userDict[i].currency += currGuild.currencyFlatRate;
                            }
                        }
                    }

                    for (j = 0; j < currGuild.bonusCurrChannel.length; j++)
                    {
                        if (currGuild.currencyRandom)
                        {
                            if (currGuild.bonusCurrChannel[j].channel == msg.channel.id)
                            {
                                currRandVal = Math.floor(Math.random() * (currGuild.currencyTopRate - currGuild.currencyBottomRate)) + currGuild.currencyBottomRate;
                                userDict[i].currency += (currGuild.bonusCurrChannel[j].bonus * currRandVal);
                            }

                            else
                            {
                                currRandVal = Math.floor(Math.random() * (currGuild.currencyTopRate - currGuild.currencyBottomRate)) + currGuild.currencyBottomRate;
                                userDict[i].currency += currRandVal;
                            }
                        }

                        else
                        {
                            if (currGuild.bonusCurrChannel[j].channel == msg.channel.id)
                            {
                                userDict[i].currency += (currGuild.bonusCurrChannel[j].bonus * currGuild.currencyFlatRate);
                            }

                            else
                            {
                                userDict[i].currency += currGuild.currencyFlatRate;
                            }
                        }
                    }
                }
            }

            userNum = i;
            createUser = false;

            userDict[i].messages++;
        }
    }

    if (createUser == true)
    {
        var obj = {guild: newServer, name: newUser.id, currency: 0, roleList: [], isAdmin: false, isMod: false, messages: 0};
        userDict.push(obj);

        userNum = userDict.length - 1;
        createUser = false;
    }

    var currUser = userDict[userNum];

    // MAIN COMMANDS

    if (msg.channel.type == "dm")
    {
        console.log(msg.author.id + " says " + msg.content)
    }

    if (msg.content.includes(client.user.id) && msg.content.includes("prefix"))
    {
        msg.channel.send("My current prefix is \"" + currGuild.prefix + "\".");
    }

    if (msg.content.includes(client.user.id) && msg.content.includes("resetprefix"))
    {
        if (msg.guild.member(msg.author).hasPermission("ADMINISTRATOR") || currUser.isAdmin)
        {
            currGuild.prefix = "!"
            msg.channel.send("My prefix has been restored to \"!\".")

            if (currGuild.logsOn && currGuild.logChannel != null)
            {
                const logEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setDescription("Admin Command Used")
                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                    .addField("The \"resetprefix\" command was used by: ", msg.author.tag + ".")
                    .addField("Prefix updated to: ", "\"!\".")
                    .setTimestamp()

                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                logsDict[logLoc].contents.push(logEmbed);
            }
        }
    }

    if (msg.content.substring(0, currGuild.prefix.length) == currGuild.prefix)
    {
        var command = msg.content.substring(currGuild.prefix.length).toLowerCase();

        if (command == "")
        {
            return;
        }

        for (i = 0; i < blacklistDict.length; i++)
        {
            if (msg.author.id == blacklistDict[i])
            {
                return;
            }
        }

        // ADMIN COMMANDS -------------------------------------------------------------------

        if (msg.guild.member(msg.author).hasPermission("ADMINISTRATOR") || currUser.isAdmin)
        {
            if (command.substring(0, 9) == "setprefix") //done
            {
                currGuild.prefix = command.substring(10);
                msg.channel.send("My prefix has been updated to \"" + currGuild.prefix + "\".")

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"setprefix\" command was used by: ", msg.author.tag + ".")
                        .addField("Prefix updated to: ", currGuild.prefix)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[serverNum].content.push(logEmbed);
                }
            }

            else if (command == "toggleshop") //done
            {
                currGuild.shopOn = !currGuild.shopOn;
                msg.channel.send("The Shop Module has been set to `" + currGuild.shopOn + "`.")
                
                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"toggleshop\" command was used by: ", msg.author.tag + ".")
                        .addField("Shop Status: ", currGuild.shopOn)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command == "togglecurrency") //done
            {
                currGuild.currencyOn = !currGuild.currencyOn;
                msg.channel.send("The Currency Module has been set to `" + currGuild.currencyOn + "`.")

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"togglecurrency\" command was used by: ", msg.author.tag + ".")
                        .addField("Currency status: ", currGuild.currencyOn)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command == "togglemoderation") //done
            {
                currGuild.moderationOn = !currGuild.moderationOn;
                msg.channel.send("The Moderation Module has been set to `" + currGuild.moderationOn + "`.")

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"togglemoderation\" command was used by: ", msg.author.tag + ".")
                        .addField("Moderation status: ", currGuild.moderationOn)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command == "togglelogs") //done
            {
                currGuild.logsOn = !currGuild.logsOn;
                msg.channel.send("The Message Logging Module has been set to `" + currGuild.logsOn + "`.")

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Moderator Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"togglelogs\" command was used by: ", msg.author.tag + ".")
                        .addField("Log status: ", currGuild.logsOn)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command.substring(0, 11) == "setcurricon") //done
            {
                if (!currGuild.currencyOn)
                {
                    msg.channel.send("Please be aware that the currency module is currently disabled.");
                }

                if (command.length == 11)
                {
                    msg.channel.send("You must assign a character or emote to the currency in order for this to work!")
                    return;
                }

                currGuild.currencyIcon = command.substring(12).toString();
                msg.channel.send("Your new currency icon is " + `${currGuild.currencyIcon}` + ".");

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"setcurricon\" command was used by: ", msg.author.tag + ".")
                        .addField("New currency icon: ", currGuild.currencyIcon)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command.substring(0, 13) == "setcurrrate f") //done
            {
                if (!currGuild.currencyOn)
                {
                    msg.channel.send("Please be aware that the currency module is currently disabled.");
                }

                try 
                {
                    currGuild.currencyFlatRate = parseInt(command.substring(14));
                    msg.channel.send("A flat rate of " + currGuild.currencyFlatRate + " " + currGuild.currencyIcon + " will be set for this server.")
                    currGuild.currencyRandom = false;

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"setcurrrate f\" command was used by: ", msg.author.tag + ".")
                            .addField("New currency rate: ", currGuild.currencyFlatRate)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                }
                catch
                {
                    msg.channel.send("I'm afraid the input given was not a valid number. Please try again.")
                }
            }

            else if (command.substring(0, 13) == "setcurrrate r") //done
            {
                if (!currGuild.currencyOn)
                {
                    msg.channel.send("Please be aware that the currency module is currently disabled.");
                }

                try
                {
                    currGuild.currencyBottomRate = parseInt(command.substring(14).split(" ")[0]);
                    currGuild.currencyTopRate = parseInt(command.substring(14).split(" ")[1]);

                    msg.channel.send("A random rate between " + currGuild.currencyBottomRate + " " + currGuild.currencyIcon + " and " + currGuild.currencyTopRate + " " + currGuild.currencyIcon + " will be set for this server.")
                    currGuild.currencyRandom = true;

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"setcurrrate r\" command was used by: ", msg.author.tag + ".")
                            .addField("New currency rates: ", currGuild.currencyBottomRate + " to " + currGuild.currencyTopRate)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                }
                catch
                {
                    msg.channel.send("I'm afraid the input given was not a valid number. Please try again.")
                }
            }

            else if (command.substring(0, 12) == "assignjail c") //done
            {
                if (!currGuild.moderationOn)
                {
                    msg.channel.send("Please be aware that the moderation module is currently disabled.");
                }

                if (msg.mentions.channels.first())
                {
                    currGuild.jailChannel = msg.mentions.channels.first().id;
                    msg.channel.send("The channel <#" + currGuild.jailChannel + "> has been assigned as the jail channel.")

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignjail c\" command was used by: ", msg.author.tag + ".")
                            .addField("New jail channel: ", "<#" + currGuild.jailChannel + ">")
                            .setTimestamp()
    
                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else
                {

                    if (command.substring(13, 31).includes("null"))
                    {
                        currGuild.jailChannel = null;

                        msg.channel.send("The jail channel has been removed.");
                        return;
                    }

                    if (msg.guild.channels.cache.some(chan => chan.id === command.substring(13, 31)))
                    {
                        currGuild.jailChannel = command.substring(13, 31);
                        msg.channel.send("The channel <#" + currGuild.jailChannel + "> has been assigned as the jail channel.")
                    }

                    else
                    {
                        msg.channel.send("I'm afraid you input an invalid channel. Please try again.")
                        return;
                    }

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignjail c\" command was used by: ", msg.author.tag + ".")
                            .addField("New jail channel: ", "<#" + currGuild.jailChannel + ">")
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                }
            }

            else if (command.substring(0, 12) == "assignjail r") //done
            {
                if (!currGuild.moderationOn)
                {
                    msg.channel.send("Please be aware that the moderation module is currently disabled.");
                }

                if (msg.mentions.roles.first())
                {
                    currGuild.jailChannel = msg.mentions.roles.first().id;
                    msg.channel.send("The role `" + msg.mentions.roles.first().name + "` has been assigned as the jail role.")

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignjail r\" command was used by: ", msg.author.tag + ".")
                            .addField("New jail role: ", "<@&" + currGuild.jailRole + ">")
                            .setTimestamp()
    
                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else
                {
                    if (command.substring(13, 31).includes("null"))
                    {
                        currGuild.jailRole = null;

                        msg.channel.send("The jail role has been removed.");
                        return;
                    }

                    if (msg.guild.roles.cache.some(chan => chan.id === command.substring(13, 31)))
                        {
                            currGuild.jailRole = command.substring(13, 31);
                            msg.channel.send("The role `" + msg.guild.roles.cache.get(currGuild.jailRole).name + "` has been assigned as the jail channel.")
                        }

                    else
                        {
                            msg.channel.send("I'm afraid you input an invalid role. Please try again.")
                            return;
                        }

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignjail r\" command was used by: ", msg.author.tag + ".")
                            .addField("New jail role: ", "<@&" + currGuild.jailRole + ">")
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                }
            }

            else if (command.substring(0, 10) == "assignlogs") //done
            {
                if (!currGuild.logsOn)
                {
                    msg.channel.send("Please be aware that the log module is currently disabled.")
                }

                if (msg.mentions.channels.first())
                {
                    currGuild.logChannel = msg.mentions.channels.first().id;
                    msg.channel.send("The channel <#" + currGuild.logChannel + "> has been assigned as the log channel.")

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignlogs\" command was used by: ", msg.author.tag + ".")
                            .addField("New log channel: ", "<#" + currGuild.logChannel + ">")
                            .setTimestamp()
    
                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else
                {
                    if (command.substring(11, 29).includes("null"))
                    {
                        currGuild.logChannel = null;
                        msg.channel.send("The log channel has been removed.")
                        return;
                    }

                    if (msg.guild.channels.cache.some(chan => chan.id === command.substring(11, 29)))
                    {
                        currGuild.logChannel = command.substring(11, 29);
                        msg.channel.send("The channel <#" + currGuild.logChannel + "> has been assigned as the log channel.")
                    }

                    else
                    {
                        msg.channel.send("I'm afraid you input an invalid channel. Please try again.")
                        return;
                    }

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignlogs\" command was used by: ", msg.author.tag + ".")
                            .addField("New log channel: ", currGuild.logChannel)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                }
            }

            else if (command.substring(0, 15) == "assignbonusrole") //done
            {
                var multiplier;
                var obj;
                
                if (msg.mentions.roles.first())
                {
                    multiplier = parseInt(command.substring(38))

                    if (isNaN(multiplier))
                    {
                        multiplier = 2;
                    }

                    obj = {role: msg.mentions.roles.first().id, bonus: multiplier}

                    currGuild.bonusCurrRole.push(obj);

                    msg.channel.send("The role `" + msg.mentions.roles.first().name + "` has been assigned as a bonus role for currency with a **x" + multiplier + "** currency multiplier.");

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignbonusrole\" command was used by: ", msg.author.tag + ".")
                            .addField("New bonus role: ", "<@&" + currGuild.bonusCurrRole + ">")
                            .addField("With bonus of: ", "x" + multiplier)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else
                {
                    multiplier = parseInt(command.substring(35))

                    if (isNaN(multiplier))
                    {
                        multiplier = 2;
                    }

                    if (msg.guild.roles.cache.some(chan => chan.id === command.substring(16, 34)))
                    {
                        obj = {role: command.substring(16, 34), bonus: multiplier}
                    }

                    else
                    {
                        msg.channel.send("I'm afraid you input an invalid role. Please try again.")
                        return;
                    }
                }

                currGuild.bonusCurrRole.push(obj);

                msg.channel.send("The role `" + msg.guild.roles.cache.get(command.substring(16, 34)).name + "` has been assigned as a bonus role for currency with a **x" + multiplier + "** currency multiplier.");

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"assignbonusrole\" command was used by: ", msg.author.tag + ".")
                        .addField("New bonus role: ", "<@&" + currGuild.bonusCurrRole + ">")
                        .addField("With bonus of: ", "x" + multiplier)
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command.substring(0, 18) == "assignbonuschannel") //done
            {
                var multiplier;
                var obj;

                if (msg.mentions.channels.first())
                {
                    multiplier = parseInt(command.substring(38))

                    if (isNaN(multiplier))
                    {
                        multiplier = 2;
                    }

                    obj = {channel: msg.mentions.channels.first().id, bonus: multiplier}

                    currGuild.bonusCurrChannel.push(obj)

                    msg.channel.send("The channel <#" + msg.mentions.channels.first().id + "> has been assigned as a bonus channel for currency.");

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignbonuschannel\" command was used by: ", msg.author.tag + ".")
                            .addField("New bonus channel: ", "<#" + currGuild.bonusCurrChannel + ">")
                            .addField("With bonus of: ", "x" + multiplier)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else
                {
                    multiplier = parseInt(command.substring(35))

                    if (isNaN(multiplier))
                    {
                        multiplier = 2;
                    }

                    if (msg.guild.roles.cache.some(chan => chan.id === command.substring(16, 34)))
                    {
                        obj = {channel: command.substring(16, 34), bonus: multiplier}
                    }

                    else
                    {
                        msg.channel.send("I'm afraid you input an invalid role. Please try again.")
                        return;
                    }

                    currGuild.bonusCurrRole.push(obj);

                    msg.channel.send("The channel <#" + command.substring(16, 34)+ "> has been assigned as a bonus channel for currency with a **x" + multiplier + "** currency multiplier.");

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Admin Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"assignbonuschannel\" command was used by: ", msg.author.tag + ".")
                            .addField("New bonus channel: <#", currGuild.bonusCurrChannel + ">")
                            .addField("With bonus of: ", "x" + multiplier)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                }
            }

            else if (command.substring(0, 15) == "removebonusrole") //done
            {
                if (command.length = 33)
                {
                    for (i = 0; i < currGuild.bonusCurrRole.length; i++)
                    {
                        if (currGuild.bonusCurrRole[i].role == command.substring(16, 34))
                        {
                            currGuild.bonusCurrRole.splice(currGuild.bonusCurrRole.indexOf(command.substring(16, 34)), 1)
                            msg.channel.send("The bonus role, `" + msg.guild.roles.cache.get(command.substring(16, 34)).name + "`, has been removed.")
                            return;
                        }
                    }
                }

                if (command.length = 38)
                {
                    for (i = 0; i < currGuild.bonusCurrRole.length; i++)
                    {
                        (currGuild.bonusCurrRole[i].role == msg.mentions.roles.first().id)
                        {
                            currGuild.bonusCurrRole.splice(currGuild.bonusCurrRole.indexOf(msg.mentions.roles.first().id), 1)
                            msg.channel.send("The bonus role, `" + msg.guild.roles.cache.get(msg.mentions.roles.first().id).name + "`, has been removed.")
                            return;
                        }
                    }
                }

                msg.channel.send("It appears that role was not in my database as a bonus role.")
                return;
            }

            else if (command.substring(0, 18) == "removebonuschannel") //done
            {
                if (command.length = 36)
                {
                    for (i = 0; i < currGuild.bonusCurrChannel.length; i++)
                    {
                        if (currGuild.bonusCurrChannel[i].channel == command.substring(19, 37))
                        {
                            currGuild.bonusCurrChannel.splice(currGuild.bonusCurrChannel.indexOf(command.substring(19, 37)), 1)
                            msg.channel.send("The bonus channel, <#" + command.substring(19, 37)+ ">, has been removed.")
                            return;
                        }
                    }
                }

                if (command.length = 39)
                {
                    for (i = 0; i < currGuild.bonusCurrChannel.length; i++)
                    {
                        if (currGuild.bonusCurrChannel[i].channel == msg.mentions.channels.first().id)
                        {
                            currGuild.bonusCurrChannel.splice(currGuild.bonusCurrChannel.indexOf(msg.mentions.channels.first().id), 1);
                            msg.channel.send("The bonus channel, <#" + msg.mentions.channels.first().id + ">, has been removed.")
                            return;
                        }
                    }
                }

                msg.channel.send("It appears that channel was not in my database as a bonus channel.")
            }

            else if (command == "showbonus") //done (Turn into embed when feeling better)
            {
                msg.channel.send("The bonus channels are: ");
                for (i = 0; i < currGuild.bonusCurrChannel.length; i++)
                {
                    msg.channel.send(msg.guild.channels.cache.get(currGuild.bonusCurrChannel[i].channel).name + " : " + currGuild.bonusCurrChannel[i].bonus)
                }

                msg.channel.send("The bonus roles are: ")
                for (i = 0; i < currGuild.bonusCurrRole.length; i++)
                {
                    msg.channel.send(msg.guild.roles.cache.get(currGuild.bonusCurrRole[i].role).name + " : " + currGuild.bonusCurrRole[i].bonus)
                }
            }

            else if (command == "resetserver") // resets server defaults
            {
                currGuild.name = newServer;
                currGuild.prefix = "!";
                currGuild.shopOn = true;
                currGuild.currencyOn = true;
                currGuild.moderationOn = true;
                currGuild.suggestionsOn = true;
                currGuild.logsOn = false;
                currGuild.shopCreated = false;
                currGuild.embedList = [];
                currGuild.shopNumRoles = 0;
                currGuild.currencyIcon = "$";
                currGuild.currencyFlatRate = 3;
                currGuild.currencyRandom = false;
                currGuild.currencyBottomRate = 1;
                currGuild.currencyTopRate = 3;
                currGuild.jailChannel = null;
                currGuild.jailRole = null;
                currGuild.adminRoles = [];
                currGuild.modRoles = [];
                currGuild.askChannel = null;
                currGuild.uniToggle = null;
                currGuild.logChannel = null;
                currGuild.bonusCurrRole = [];
                currGuild.bonusCurrChannel = [];

                msg.channel.send("The default settings for the server have been restored.")
            }

	        else if (command.substring(0, 11) == "assignmod u")  // finished
            {
                if (msg.mentions.members.first())
                {
                    for (i = 0; i < userDict.length; i++)
                    {
                        if (userDict[i].name == msg.mentions.members.first().id && userDict[i].guild == currGuild.name)
                        {
                            userDict[i].isMod = !userDict[i].isMod;
                            msg.channel.send("This user's mod status has been updated to: `" + userDict[i].isMod + "`.")
                            return;
                        }
                    }
                }

                if (msg.guild.members.cache.some(chan => chan.id === command.substring(12, 30)))
                {
                    for (i = 0; i < userDict.length; i++)
                    {
                        if (userDict[i].name == command.substring(12, 30) && userDict[i].guild == currGuild.name)
                        {
                            userDict[i].isMod = !userDict[i].isMod;
                            msg.channel.send("This user's mod status has been updated to: `" + userDict[i].isMod + "`.")
                            return;
                        }
                    }
                }

                msg.channel.send("It seems this user was not in my database. Please try again.")
	        }

	        else if (command.substring(0, 13) == "assignadmin u")  // finished
            {
                if (msg.mentions.members.first())
                {
                    for (i = 0; i < userDict.length; i++)
                    {
                        if (userDict[i].name == msg.mentions.members.first().id && userDict[i].guild == currGuild.name)
                        {
                            userDict[i].isAdmin = !userDict[i].isAdmin;
                            msg.channel.send("This user's admin status has been updated to: `" + userDict[i].isAdmin + "`.")
                            return;
                        }
                    }
                }

                if (msg.guild.members.cache.some(chan => chan.id === command.substring(14, 32)))
                {
                    for (i = 0; i < userDict.length; i++)
                    {
                        if (userDict[i].name == command.substring(14, 32) && userDict[i].guild == currGuild.name)
                        {
                            userDict[i].isAdmin = !userDict[i].isAdmin;
                            msg.channel.send("This user's admin status has been updated to: `" + userDict[i].isAdmin + "`.")
                            return;
                        }
                    }
                }

                msg.channel.send("It seems this user was not in my database. Please try again.")
            }

            else if (command.substring(0, 9) == "assignmod")  // finished
            {
                if (currGuild.modRoles.includes(command.substring(10, 28)))
                {
                    for (i = 0; i < currGuild.modRoles.length; i++)
                    {
                        if (currGuild.modRoles[i] == command.substring(10, 28))
                        {
                            currGuild.modRoles.splice(i, 1);

                            msg.channel.send("This role has been removed from its moderator status. Please use the \"updatemods\" command to refresh my settings.")

                            if (currGuild.logsOn && currGuild.logChannel != null)
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Admin Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("The \"assignmod\" command was used by: ", msg.author.tag + ".")
                                    .addField("Role removed from moderator: ", "<@&" + command.substring(10, 28) + ">")
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }
                            return;
                        }
                    }
                }

                else
                {
                    if (msg.mentions.roles.first())
                    {
                        currGuild.modRoles.push(msg.mentions.roles.first().id)

                        msg.channel.send("This role has been marked as a moderator. Please use the \"updatemods\" command to refresh my settings.")

                        if (currGuild.logsOn && currGuild.logChannel != null)
                        {
                            const logEmbed = new Discord.MessageEmbed()
                                .setColor('#cf98c5')
                                .setDescription("Admin Command Used")
                                .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                .addField("The \"assignmod\" command was used by: ", msg.author.tag + ".")
                                .addField("Role added to moderator: ", "<@&" + msg.mentions.roles.first().id + ">")
                                .setTimestamp()

                            client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                            logsDict[logLoc].contents.push(logEmbed);
                        }

                        return;
                    }

                    else
                    {
                        if (msg.guild.roles.cache.some(chan => chan.id === command.substring(10, 28)))
                        {
                            currGuild.modRoles.push(command.substring(10, 28))

                            msg.channel.send("This role has been marked as a moderator. Please use the \"updatemods\" command to refresh my settings.")

                            if (currGuild.logsOn && currGuild.logChannel != null)
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Admin Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("The \"assignmod\" command was used by: ", msg.author.tag + ".")
                                    .addField("Role added to moderator: ", "<@&" + command.substring(10, 28) + ">")
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }

                            return;
                        }

                        msg.channel.send("It seems the role given was not a valid role. Please try again.")

                    }

                }
            }

            else if (command.substring(0, 11) == "assignadmin")  // finished
            {
                if (currGuild.adminRoles.includes(command.substring(12, 30)))
                {
                    for (i = 0; i < currGuild.adminRoles.length; i++)
                    {
                        if (currGuild.adminRoles[i] == command.substring(12, 30))
                        {
                            currGuild.adminRoles.splice(i, 1);

                            msg.channel.send("This role has been removed from its administrator status. Please use the \"updatemods\" command to refresh my settings.")

                            if (currGuild.logsOn && currGuild.logChannel != null)
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Admin Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("The \"assignadmin\" command was used by: ", msg.author.tag + ".")
                                    .addField("Role removed from admin: ", "<@&" + command.substring(12, 30) + ">")
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }
                            return;
                        }
                    }
                }

                else
                {
                    if (msg.mentions.roles.first())
                    {
                        currGuild.adminRoles.push(msg.mentions.roles.first().id)

                        msg.channel.send("This role has been marked as a administrator. Please use the \"updatemods\" command to refresh my settings.")

                        if (currGuild.logsOn && currGuild.logChannel != null)
                        {
                            const logEmbed = new Discord.MessageEmbed()
                                .setColor('#cf98c5')
                                .setDescription("Admin Command Used")
                                .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                .addField("The \"assignadmin\" command was used by: ", msg.author.tag + ".")
                                .addField("Role added to admin: ", "<@&" + msg.mentions.roles.first().id + ">")
                                .setTimestamp()

                            client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                            logsDict[logLoc].contents.push(logEmbed);
                        }

                        return;
                    }

                    else
                    {
                        if (msg.guild.roles.cache.some(chan => chan.id === command.substring(12, 30)))
                        {
                            currGuild.adminRoles.push(command.substring(12, 30))

                            msg.channel.send("This role has been marked as a administrator. Please use the \"updatemods\" command to refresh my settings.")

                            if (currGuild.logsOn && currGuild.logChannel != null)
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Admin Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("The \"assignadmin\" command was used by: ", msg.author.tag + ".")
                                    .addField("Role added to admin: ", "<@&" + command.substring(12, 30) + ">")
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }

                            return;
                        }

                        msg.channel.send("It seems the role given was not a valid role. Please try again.")

                    }
                }
            }

            else if (command == "updatemods")  // finished
            {
                var markedMod = [];
                msg.channel.send("Administrator assignment is currently ongoing. Please wait.");

                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].guild === currGuild.name)
                    {
                        if (msg.guild.member(userDict[i].name) != null)
                        {
                            var user = msg.guild.member(userDict[i].name) // FUUUUCKK YESSSSS

                            for (j = 0; j < currGuild.adminRoles.length; j++)
                            {
                                if (markedMod.includes(userDict[i].name))
                                {
                                    continue;
                                }

                                else
                                {
                                
                                    if (user.roles.cache.has(currGuild.adminRoles[j]))
                                    {
                                        markedMod.push(userDict[i].name);
                                        userDict[i].isAdmin = true;
                                        continue;
                                    }

                                    else
                                    {
                                        userDict[i].isAdmin = false;
                                    }
                            
                                }
                            }
                        }
                    }
                }

                msg.channel.send("Administrator assignment has been completed. Please wait while I process the moderators.");

                
                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].guild == currGuild.name)
                    {
                        if (msg.guild.member(userDict[i].name) != null)
                        {
                            var user = msg.guild.member(userDict[i].name) // FUUUUCKK YESSSSS

                            for (j = 0; j < currGuild.modRoles.length; j++)
                            {
                                if (markedMod.includes(userDict[i].name))
                                {
                                    continue;
                                }

                                else
                                {
                                    if (user.roles.cache.has(currGuild.modRoles[j]))
                                    {
                                        userDict[i].isMod = true;
                                        continue;
                                    }

                                    else
                                    {
                                        userDict[i].isMod = false;
                                    }
                                }
                            }
                        }
                    }
                }

                msg.channel.send("Moderator assignment has been completed. Commands should work normally.")

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Admin Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"updatemods\" command was used by: ", msg.author.tag + ".")
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command.substring(0, 11) == "modmessages")
            {
                var atUser;
                var mes;

                if (msg.mentions.users.first() != undefined)
                {
                    atUser = msg.mentions.users.first();
                    mes = command.substring(35)
                }

                else if (msg.guild.member(command.substring(12, 30)) != undefined)
                {
                    atUser = msg.guild.members.cache.get(command.substring(12, 30)).id;
                    mes = command.substring(31)
                }

                for (i = 0; i < userDict.length; i++)
                {
                    if (atUser == userDict[i].name && userDict[i].guild == currGuild.name)
                    {
                        userDict[i].messages += parseInt(mes)

                        msg.channel.send(msg.guild.member(atUser).user.tag + ": " + (userDict[i].messages - mes) + " -> " + userDict[i].messages)
                    }
                }
            }

            else if (command == "showlogs")  // finished
            {
                var iterator = 0;

                msg.channel.send({embed:logsDict[logLoc].contents[0]}).then(r => {
                    r.react("◀️")
                    r.react("▶️")

                const collector = r.createReactionCollector((reaction, user) => user.id == msg.author.id && (reaction.emoji.name == '▶️' || reaction.emoji.name == '◀️'),
                { time: 30000 });

                collector.on('collect', k => {

                    if (k.emoji.name == '▶️'  && iterator + 1 != logsDict[logLoc].contents.length - 2)
                    {
                        iterator++;
                        r.edit({embed:logsDict[logLoc].contents[iterator]});

                        collector.resetTimer();

                        k.users.remove(msg.author);
                    }

                    if (k.emoji.name == '◀️' && iterator - 1 != -1)
                    {
                        iterator--;
                        r.edit({embed:logsDict[logLoc].contents[iterator]});

                        collector.resetTimer();

                        k.users.remove(msg.author);
                    }
                    })
                })

                return;
            }

            else if (command == "help a") //done
            {
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle("Towa's Administrator Help Menu - Prefix: \"" + currGuild.prefix + "\"")
                    .addFields(
                        {name: "Setprefix", value: ("Sets the prefix to the input."), inline: true},
                        {name: "Togglecurrency", value: ("Switches the status of the currency module to either off or on."), inline: true},
                        {name: "Toggleshop", value: ("Switches the status of the shop module to either off or on. Works with currency closely."), inline: true},
                        {name: "Togglemoderation", value: ("Switches the status of the moderation module to either off or on."), inline: true},
                        {name: "Togglelogs", value: ("Switches the status of the logging module to either off or on."), inline: true},
                        {name: "Setcurricon", value: ("Changes the icon of the server's currency."), inline: true},
                        {name: "Setcurrrate", value: ("Sets the currency rate of the server. Can be fixed or random."), inline: true},
                        {name: "Assignjail", value: ("Sets the channel and the role for the jail command."), inline: true},
                        {name: "Assignlogs", value: ("Sets the channel that logs go to."), inline: true},
                        {name: "Resetserver", value: ("Resets the server to Towa defaults. Very dangerous. Does not affect users."), inline: true},
                        {name: "Assignmod", value: ("Assigns a role or user to use the moderator commands."), inline: true},
                        {name: "Assignadmin", value: ("Assigns a role or user to use the administrator commands."), inline: true},
                        {name: "Updatemods", value: ("Grants all members with admin or mod roles their status. It also takes them away. Will wipe user assignments."), inline: true},
                        {name: "Showlogs", value: ("Shows all the logs in the server in an easily manueverable embed."), inline: true},
                        {name: "Syntax a", value: "Shows the syntax for all admin commands.", inline: true}
                    )

                msg.channel.send(helpEmbed);
            }

            else if (command == "syntax a") //done
            {
                const syntaxEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle("Towa's Administrator Syntax Menu - Prefix: \"" + currGuild.prefix + "\"")
                    .addFields(
                        {name: "Setprefix", value: "`setprefix <PREFIX>`", inline: true},
                        {name: "Togglecurrency", value: "`togglecurrency`", inline: true},
                        {name: "Toggleshop", value: "`toggleshop`", inline: true},
                        {name: "Togglemoderation", value: "`togglemoderation`", inline: true},
                        {name: "Togglelogs", value: "`togglelogs`", inline: true},
                        {name: "Setcurricon", value: "`setcurricon <ICON>`", inline: true},
                        {name: "Setcurrrate", value: "`setcurrrate f <VALUE> - setcurrrate r <BOTTOM> <TOP>`", inline: true},
                        {name: "Assignjail", value: "`assignjail c <CHANNEL ID> - assignjail r <ROLE ID>`", inline: true},
                        {name: "Assignlogs", value: "`assignlogs <CHANNEL ID>`", inline: true},
                        {name: "Resetserver", value: "`resetserver`", inline: true},
                        {name: "Assignmod", value: "`assignmod <ROLE ID> - assignmod u <USER ID>`", inline: true},
                        {name: "Assignadmin", value: "`assignadmin <ROLE ID> - assignadmin u <USER ID>`", inline: true},
                        {name: "Updatemods", value: "`updatemods`", inline: true},
                        {name: "Showlogs", value: "`showlogs`", inline: true}
                    )

                msg.channel.send(syntaxEmbed)
            }
        }
        
        // MOD COMMANDS ---------------------------------------------------------------
        
        if (msg.guild.member(msg.author).hasPermission("BAN_MEMBERS") || msg.guild.member(msg.author).hasPermission("ADMINISTRATOR") || currUser.isMod || currUser.isAdmin)
        {
            if (command == "modules") //done
            {
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle('Currently Implemented Modules')
                    .setAuthor('Towa', 'https://cdn.discordapp.com/attachments/722302128038608939/767882367217041428/towasmug.png')
                    .setDescription('Current modules allowed and disallowed.')
                    .addFields(
                        { name: 'Shop Module', value: currGuild.shopOn },
                        { name: 'Currency Module', value: currGuild.currencyOn},
                        { name: 'Moderation Module', value: currGuild.moderationOn},
                        { name: 'Message Logging Module', value: currGuild.logsOn}
                    )
                    .setTimestamp()

                msg.channel.send(exampleEmbed);
            }

            else if (command == "currsettings") //done
            {
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setDescription('Currency Module Settings')
                    .setAuthor('Towa', 'https://cdn.discordapp.com/attachments/722302128038608939/767882367217041428/towasmug.png')
                    .addFields(
                        { name: 'Currency on?: ' + currGuild.currencyOn + "\n" + 'Currency random on?: ' + currGuild.currencyRandom, value: "___________"},
                        { name: 'Currency icon: ' + currGuild.currencyIcon, value: "___________"},
                        { name: 'Currency flat rate: ' + currGuild.currencyFlatRate + "\n" + 'Currency random rate bounds: ' + currGuild.currencyBottomRate + ", " + currGuild.currencyTopRate, value: "___________"}
                    )
                    .setTimestamp()

                msg.channel.send(exampleEmbed);
            }

            else if (command.substring(0, 8) == "givecurr") //done
            {
                if (currGuild.currencyOn == false)
                {
                    msg.channel.send("The currency module is currently disabled.");
                    return;
                }

                var userr;
                var cur;
                
                if (msg.mentions.users.first())
                {
                    userr = msg.mentions.users.first().id;
                    cur = command.substring(31)
                }

                else if (msg.guild.members.cache.some(chan => chan.id === command.substring(9, 27)))
                {
                    userr = command.substring(9, 27)
                    cur = command.substring(28)
                }

                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].name === userr && currGuild.name == userDict[i].guild)
                    {
                        try
                        {
                            let memberUsername = client.users.cache.get(userr).tag;

                            userDict[i].currency += parseInt(cur);

                            msg.channel.send(memberUsername + ": " + (userDict[i].currency - cur) + " " + currGuild.currencyIcon + " --> " + userDict[i].currency + " " + currGuild.currencyIcon);
                            
                            if (currGuild.logsOn && currGuild.logChannel != null)
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Moderator Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("The \"givecurr\" command was used by: ", msg.author.tag + " on " + memberUsername + " for " + cur + currGuild.currencyIcon)
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }

                            return;
                        }
                        catch
                        {
                            msg.channel.send("I'm afraid the input given was not a valid number. Please try again");
                        }
                    }
                }
            }

            else if (command.substring(0, 7) == "giveall") //done
            {
                if (currGuild.currencyOn == false)
                {
                    msg.channel.send("The currency module is currently disabled.");
                    return;
                }

                var idd;

                if (msg.mentions.roles.first())
                {
                    idd = msg.mentions.roles.first().id;

                    const roly = msg.guild.roles.cache.find(role => role.id === idd);

                    const memb = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == roly)).map(member => member.user.id)

                    for (i = 0; i < memb.length; i++)
                    {
                        for (j = 0; j < userDict.length; j++)
                        {
                            if (userDict[j].name == memb[i] && currGuild.name == userDict[j].guild)
                            {
                                userDict[j].currency += parseInt(command.substring(31));
                            }
                        }
                    }

                    msg.channel.send("All members of the " + msg.mentions.roles.first().name + " role have been given " + command.substring(31) + currGuild.currencyIcon + ".")
                    
                    
                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Moderator Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"giveall\" command was used by: ", msg.author.tag + " on " + msg.mentions.roles.first().name + " for " + command.substring(31) + currGuild.currencyIcon)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }
                

                else if (msg.guild.roles.cache.some(chan => chan.id === command.substring(8, 26)))
                {
                    idd = command.substring(8, 26)

                    const roly = msg.guild.roles.cache.find(role => role.id === idd);

                    const memb = msg.guild.members.cache.filter(member => member.roles.cache.find(role => role == roly)).map(member => member.user.id)

                    for (i = 0; i < memb.length; i++)
                    {
                        for (j = 0; j < userDict.length; j++)
                        {
                            if (userDict[j].name == memb[i] && currGuild.name == userDict[j].guild)
                            {
                                userDict[j].currency += parseInt(command.substring(27));
                            }
                        }
                    }

                    msg.channel.send("All members of the " + msg.guild.roles.cache.get(command.substring(8, 26)).name + " role have been given " + command.substring(27) + currGuild.currencyIcon + ".")
                    
                    
                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Moderator Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"giveall\" command was used by: ", msg.author.tag + " on " + msg.guild.roles.cache.find(role => role.id === command.substring(8, 26)).name + " for " + command.substring(27) + currGuild.currencyIcon)
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                }

                msg.channel.send("It seems that the role given was not in my database. Please try again.")
                
            }

            else if (command.substring(0, 11) == "addshoprole") //done
            {
                if (currGuild.shopOn == false)
                {
                    msg.channel.send("The shop module is currently disabled.");
                    return;
                }

                var item;
                var price;

                if (msg.mentions.roles.first())
                {
                    item = msg.mentions.roles.first().id
                    price = command.substring(35);
                }

                else if (msg.guild.roles.cache.some(chan => chan.id === command.substring(12, 30)))
                {
                    item = command.substring(12, 30)
                    price = command.substring(31)
                }

                else
                {
                    msg.channel.send("The role given is invalid. Please try again.")
                    return;
                }

                for (i = 0; i < shopDict.length; i++)
                {
                    for (j = 0; j < shopDict[i].contents.length; j++)
                    {
                        if (shopDict[i].contents[j].value.id == item)
                        {
                            msg.channel.send("This role has already been added to the shop.");
                            return;
                        }
                    }
                }

                if (currGuild.shopNumRoles != 0)
                {
                    var obj1 = {role: "Role #" + currGuild.shopNumRoles, value: msg.guild.roles.cache.get(item), price: price}
                    
                    for (i = 0; i < shopDict.length; i++)
                    {
                        if (shopDict[i].guild == currGuild.name)
                        {
                            shopDict[i].contents.push(obj1);
                            currGuild.shopNumRoles++;

                            currGuild.shopCreated = true;

                            shopDict[i].numRoles++;

                            msg.channel.send("This role has been added to the shop at the price of " + price + " " + currGuild.currencyIcon + ".");

                            if (currGuild.logsOn && currGuild.logChannel != null)
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Moderator Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("The \"addshoprole\" command was used by: ", msg.author.tag + " and they added the <@&" + item + "> role for " + price + currGuild.currencyIcon + ".")
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }

                            return;
                        }
                    }
                }

                else
                {
                    var obj = {numRoles: 1, guild: newServer, contents: [{role: "Role #" + currGuild.shopNumRoles, value: msg.guild.roles.cache.get(item), price: price}]}
                    shopDict.push(obj);

                    currGuild.shopNumRoles++;

                    currGuild.shopCreated = true;

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Moderator Command Used")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField("Shop Creation Notice", "Done by: " + msg.author.tag)
                                    .addField("The \"addshoprole\" command was used by: ", msg.author.tag + ".")
                                    .addField("Role added: ", + "<@&" + item + ">")
                                    .addField("Price: ", price + currGuild.currencyIcon)
                                    .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }
                    
                    msg.channel.send("This role has been added to the shop at the price of " + price + " " + currGuild.currencyIcon + ". The shop is now available to populate.");
                    return;
                }
            }

            else if (command.substring(0, 14) == "removeshoprole") //done
            {
                if (currGuild.shopOn == false)
                {
                    msg.channel.send("The shop module is currently disabled.");
                    return;
                }

                if (shopDict == null)
                {
                    msg.channel.send("The shop is already empty.")
                    return;
                }

                var item;

                if (msg.mentions.roles.first())
                {
                    item = msg.mentions.roles.first().id
                }

                else if (msg.guild.roles.cache.some(chan => chan.id === command.substring(15, 33)))
                {
                    item = command.substring(15, 33)
                }

                else
                {
                    msg.channel.send("The role given is invalid. Please try again.")
                    return;
                }
                
                for (i = 0; i < shopDict.length; i++)
                {
                    if (shopDict[i].guild == newServer)
                    {
                        for (j = 0; j < shopDict[i].contents.length; j++)
                        {
                            if (shopDict[i].contents[j].value.id == item)
                            {
                                shopDict[i].contents.splice(j, 1);
                                msg.channel.send("This role has been removed from the shop.")
                                currGuild.shopNumRoles--;

                                if (currGuild.logsOn && currGuild.logChannel != null)
                                {
                                    const logEmbed = new Discord.MessageEmbed()
                                        .setColor('#cf98c5')
                                        .setDescription("Moderator Command Used")
                                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                        .addField("The \"removeshoprole\" command was used by: ", msg.author.tag + ".")
                                        .addField("Role removed: ", "<&" + item + ">")
                                        .setTimestamp()

                                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                    logsDict[logLoc].contents.push(logEmbed);
                                }
                                
                                if (shopDict == null)
                                {
                                    currGuild.shopCreated = false;
                                }

                                return;
                            }
                        }
                    }
                }

                msg.channel.send("I'm afraid there was no shop value with this ID.");
            }          

            else if (command == "populateshop") //done
            {
                if (currGuild.shopOn == false)
                {
                    msg.channel.send("The shop module is currently disabled.");
                    return;
                }

                if (shopDict.length == 0)
                {
                    msg.channel.send("Please add a role to the shop in order to populate it for purchase.");
                    return;
                }

                currGuild.shopCreated = true;
                var beenAdded = [];
                currGuild.embedList = [];

                for (k = 0; k < shopDict.length; k++)  // to find the guild
                {
                    if (shopDict[k].guild == currGuild.name)
                    {
                        for (i = 0; i < shopDict[k].contents.length; i += 5)  // to set up the embed properly
                        {
                            var len = parseInt(shopDict[k].contents.length / 5);
                            currGuild.embedList[i / 5] = new Discord.MessageEmbed();
                            currGuild.embedList[i / 5].setColor('#cf98c5');
                            currGuild.embedList[i / 5].setTitle("Role Shop");

                            if (shopDict[k].contents.length % 5 == 0)
                            {
                                len = parseInt(shopDict[k].contents.length / 5) - 1;
                            }
                            
                            currGuild.embedList[i / 5].setFooter("Page " + (i / 5 + 1) + " of " + parseInt(len + 1) + ". Use \"shop x\" to navigate the pages.")

                            for (j = i; j < i + 5; j++)  // to populate the embed
                            {
                                if (shopDict[k].contents[j] != undefined && !beenAdded.includes(j))
                                {
                                    currGuild.embedList[i / 5].addField("Role #" + (j + 1), "<@&" + shopDict[k].contents[j].value.id + ">   -   Price: " + shopDict[k].contents[j].price + " " + currGuild.currencyIcon)
                                    beenAdded.push(j);
                                }
                            }
                        }
                    }
                }

                msg.channel.send("Shop populated with updated roles.");

                if (currGuild.logsOn && currGuild.logChannel != null)
                {
                    const logEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setDescription("Moderator Command Used")
                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                        .addField("The \"populateshop\" command was used by: ", msg.author.tag + ".")
                        .setTimestamp()

                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                    logsDict[logLoc].contents.push(logEmbed);
                }
            }

            else if (command.substring(0, 10) == "removerole") //done
            {
                var item;
                var person;

                if (msg.mentions.roles.first())
                {
                    person = msg.mentions.members.first().id
                    item = msg.mentions.roles.first().id
                }

                else if (msg.guild.roles.cache.some(chan => chan.id === command.substring(11, 29)))
                {
                    person = command.substring(11, 29);
                    item = command.substring(30, 48)
                }

                else
                {
                    msg.channel.send("The role given is invalid. Please try again.")
                    return;
                }

                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].name === person && userDict[i].guild == newServer)
                    {
                        for (j = 0; j < userDict[i].roleList.length; j++)
                        {
                            if (userDict[i].roleList[j] == item)
                            {
                                userDict[i].roleList.splice(j, 1);
                                msg.guild.member(userDict[i].name).roles.remove(msg.guild.roles.cache.get(item));

                                msg.channel.send("This role has been removed from user " + msg.guild.member(userDict[i].name).displayName + "'s account.")

                                if (currGuild.logsOn && currGuild.logChannel != null)
                                {
                                    const logEmbed = new Discord.MessageEmbed()
                                        .setColor('#cf98c5')
                                        .setDescription("Moderator Command Used")
                                        .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                        .addField("The \"removerole\" command was used by: ", msg.author.tag + " on " + msg.guild.member(userDict[i].name) + ".")
                                        .addField("Role Removed: ", msg.guild.roles.cache.get(item).name)
                                        .setTimestamp()

                                    client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                    logsDict[logLoc].contents.push(logEmbed);
                                }

                                return;
                            }
                        }
                    }
                }
            }

            else if (command.substring(0, 7) == "addrole") //done
            {
                var item;
                var person;

                if (msg.mentions.roles.first())
                {
                    person = msg.mentions.members.first().id
                    item = msg.mentions.roles.first().id
                }

                else if (msg.guild.roles.cache.some(chan => chan.id === command.substring(8, 26)))
                {
                    person = command.substring(8, 26);
                    item = command.substring(27, 45)
                }

                else
                {
                    msg.channel.send("The role given is invalid. Please try again.")
                    return;
                }

                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].name === person && userDict[i].guild == newServer)
                    {
                        msg.guild.member(userDict[i].name).roles.add(msg.guild.roles.cache.get(item));
                        userDict[i].roleList.push(item);

                        msg.channel.send("This role has been add to user " + msg.guild.member(userDict[i].name).displayName + "'s account.")

                        if (currGuild.logsOn && currGuild.logChannel != null)
                        {
                            const logEmbed = new Discord.MessageEmbed()
                                .setColor('#cf98c5')
                                .setDescription("Moderator Command Used")
                                .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                .addField("The \"addrole\" command was used by: ", msg.author.tag + " on " + msg.guild.member(userDict[i].name) + ".")
                                .addField("Role added: ", msg.guild.roles.cache.get(item).name)
                                .setTimestamp()

                            client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                            logsDict[logLoc].contents.push(logEmbed);
                        }

                        return;
                    }
                }
            }

            else if (command.substring(0, 4) == "jail") //done
            {
                if (currGuild.jailChannel == null || currGuild.jailRole == null)
                {
                    msg.channel.send("The Jail command has not been completed yet. Please set both the channel and the role for it to work.");
                    return;
                }

                if (currGuild.moderationOn == false)
                {
                    msg.channel.send("The moderation module is currently disabled.");
                    return;
                }

                if (msg.mentions.users.first())
                {
                    atMember = msg.mentions.users.first().id
                }

                else if (msg.guild.members.cache.some(chan => chan.id === command.substring(5, 23)))
                {
                    atMember = command.substring(5, 23)
                }

                else
                {
                    msg.channel.send("It seems the user you provided was not in my database. Please try again.")
                }

                var time = command.substring(26);

                    if (time == "")
                    {
                        var newTime = 1800000;  // 30 minutes
                    }

                    else
                    {

                        time = time.replace(time.charAt((time.length - 1)), "");

                        var newTime = parseInt(time);

                        if (command.substring(26).endsWith("s"))
                        {
                            newTime = newTime * 1000;
                        }

                        else if (command.substring(26).endsWith("m"))
                        {
                            newTime = newTime * (1000 * 60);
                        }

                        else if (command.substring(26).endsWith("h"))
                        {
                            newTime = newTime * (1000 * 60 * 60);
                        }
                    }

                    let memberUsername = msg.guild.member(atMember);

                    if (memberUsername == null)
                    {
                        msg.channel.send("User not found, please try again.");
                        return;
                    }

                    var jailRoles = [];

                    for (i = 0; i < userDict.length; i++)
                    {
                        if (userDict[i].name === atMember && userDict[i].guild == currGuild.name)
                        {
                            
                            if (msg.guild.member(atMember).hasPermission("ADMINISTRATOR"))
                            {
                                msg.channel.send("This member cannot be jailed!");
                                return;
                            }

                            else
                            {
                                jailRoles = msg.guild.member(atMember).roles.cache.array()

                                msg.guild.member(atMember).roles.set([]);
                                msg.guild.member(atMember).roles.add(currGuild.jailRole); // you... :reeeee:
                            }
                        }
                    }

                    setTimeout(function()
                    {
                        msg.guild.member(atMember).roles.set(jailRoles);

                        msg.guild.member(atMember).roles.remove(currGuild.jailRole);

                        console.log(memberUsername + " has been unjailed.");

                        if (currGuild.logsOn && currGuild.logChannel != null)
                        {
                            try
                            {
                                const logEmbed = new Discord.MessageEmbed()
                                    .setColor('#cf98c5')
                                    .setDescription("Moderator Command Ended")
                                    .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                    .addField(msg.guild.member(atMember).user.tag + " has been freed from jail.")
                                    .setTimestamp()

                                client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                                logsDict[logLoc].contents.push(logEmbed);
                            }
                            catch
                            {
                                return;
                            }
                        }

                    }, newTime)

                    console.log(msg.guild.member(atMember) + " has been jailed for " + newTime + " milliseconds.");

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        try
                        {
                            const logEmbed1 = new Discord.MessageEmbed()
                                .setColor('#cf98c5')
                                .setDescription("Moderator Command Used")
                                .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                                .addField("The \"jail\" command was used by: ", msg.author.tag + " on " + msg.guild.member(atMember).user.tag + ".")
                                .addField("Jail time: ", newTime)
                                .setTimestamp()

                            client.channels.cache.get(currGuild.logChannel).send(logEmbed1);
                            logsDict[logLoc].contents.push(logEmbed1);
                        }
                        catch
                        {
                            client.channels.cache.get(currGuild.logChannel).send("A user has used the jail command on themselves.");
                        }
                    }
            }

            else if (command.substring(0, 13) == "setaskchannel") //done
            {
                if (msg.mentions.channels.first())
                {
                    currGuild.askChannel = msg.mentions.channels.first().id;
                    msg.channel.send("The channel <#" + currGuild.askChannel + "> has been assigned as the ask channel.")

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Moderator Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"setaskchannel\" command was used by: ", msg.author.tag + ".")
                            .addField("New ask channel: ", "<#" + currGuild.askChannel + ">")
                            .setTimestamp()
    
                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else
                {

                    if (command.substring(14, 32).includes("null"))
                    {
                        currGuild.askChannel = null;

                        msg.channel.send("The ask channel has been removed.");
                        return;
                    }

                    if (msg.guild.channels.cache.some(chan => chan.id === command.substring(14, 32)))
                    {
                        currGuild.askChannel = command.substring(14, 32);
                        msg.channel.send("The channel <#" + currGuild.askChannel + "> has been assigned as the ask channel.")
                    }

                    else
                    {
                        msg.channel.send("I'm afraid you input an invalid channel. Please try again.")
                        return;
                    }

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Moderator Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"setaskchannel\" command was used by: ", msg.author.tag + ".")
                            .addField("New ask channel: ", "<#" + command.substring(14, 32) + ">")
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }
            }

            else if (command.substring(0, 6) == "answer")  //done
            {
                var usr;

                if (msg.mentions.users.first())
                {
                    usr = msg.mentions.users.first().id;

                    const answerEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setTitle(msg.author.username + " : ")
                        .addField("Answer: ", msg.content.substring(31))
                        .setTimestamp()

                    client.users.cache.get(user).send(answerEmbed);

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Moderator Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"answer\" command was used by: ", msg.author.tag + ".")
                            .addField("Answer: ", msg.content.substring(31))
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                else if (msg.guild.members.cache.some(chan => chan.id === command.substring(7, 25)))
                {
                    usr = command.substring(7, 25)

                    const answerEmbed = new Discord.MessageEmbed()
                        .setColor('#cf98c5')
                        .setTitle(msg.author.username + " : ")
                        .addField("Answer: ", msg.content.substring(27))
                        .setTimestamp()

                        client.users.cache.get(usr).send(answerEmbed);

                    if (currGuild.logsOn && currGuild.logChannel != null)
                    {
                        const logEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setDescription("Moderator Command Used")
                            .setAuthor(msg.author.tag + "  -  " + msg.author.id)
                            .addField("The \"answer\" command was used by: ", msg.author.tag + ".")
                            .addField("Answer: ", msg.content.substring(27))
                            .setTimestamp()

                        client.channels.cache.get(currGuild.logChannel).send(logEmbed);
                        logsDict[logLoc].contents.push(logEmbed);
                    }

                    return;
                }

                msg.channel.send("It seems the user you provided was not in my database.")
            }

            else if (command.substring(0, 8) == "embedify") //done
            {
                if (command.substring(0, 10) == "embedify a")
                {
                    try
                    {
                        const sendingEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setTimestamp()

                        sendingEmbed.addField(msg.author.tag, msg.content.substring(12))

                        msg.delete();

                        msg.channel.send(sendingEmbed);
                    }
                    catch
                    {
                        msg.channel.send("I'm afraid that didn't quite work out as planned. Please try again.");
                    }
                }
                else
                {
                    try
                    {
                        const sendingEmbed = new Discord.MessageEmbed()
                            .setColor('#cf98c5')
                            .setTimestamp()

                        sendingEmbed.addField( "\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_", msg.content.substring(10))

                        msg.delete();

                        msg.channel.send(sendingEmbed);
                    }
                    catch
                    {
                        msg.channel.send("I'm afraid that didn't quite work out as planned. Please try again.");
                    }
                }
            }

            else if (command == "help m") //done
            {
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle("Towa's Moderator Help Menu - Prefix: \"" + currGuild.prefix + "\"")
                    .addFields(
                        {name: "Modules", value: ("Lets you see which Towa modules are currently active."), inline: true},
                        {name: "Currsettings", value: ("Shows the current currency settings."), inline: true},
                        {name: "Givecurr", value: ("Allows you to give currency to another user, both in positive and negative values."), inline: true},
                        {name: "Addshoprole", value: ("Adds a role to the shop for a price. Make the price 0 if you'd like a free one."), inline: true},
                        {name: "Removeshoprole", value: ("Removes a shop role based on ID. Doesn't work if the role isn't in the shop."), inline: true},
                        {name: "Populateshop", value: ("Adds all current roles and prices to the shop."), inline: true},
                        {name: "Addrole", value: ("Adds a role to a user, given that Towa is above the role."), inline: true},
                        {name: "Removerole", value: ("Removes a role from a user, given that Towa is above the role."), inline: true},
                        {name: "Jail", value: ("Sends a user to a timeout channel for either 30 minutes or an input time."), inline: true},
                        {name: "Setaskchannel", value: ("Sets the channel for questions to be shown in."), inline: true},
                        {name: "Answer", value: ("Sends a DM to the user with their answer."), inline: true},
                        {name: "Embedify", value: ("Creates an embed with either the user's name as the title or dashes as the title."), inline: true},
                        {name: "Syntax m", value: "The syntax for each moderator command.", inline: true}
                    )

                msg.channel.send(helpEmbed);
            }

            else if (command == "syntax m") //done
            {
                const syntaxEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle("Towa's Moderator Syntax Menu - Prefix: \"" + currGuild.prefix + "\"")
                    .addFields(
                        {name: "Modules", value: "`modules`", inline: true},
                        {name: "Currsettings", value: "`currsettings`", inline: true},
                        {name: "Givecurr", value: "`givecurr <USER> <AMOUNT>`", inline: true},
                        {name: "Addshoprole", value: "`addshoprole <ROLE ID> <PRICE>`", inline: true},
                        {name: "Removeshoprole", value: "`removeshoprole <ROLE ID>`", inline: true},
                        {name: "Populateshop", value: "`populateshop`", inline: true},
                        {name: "Addrole", value: "`addrole <USER> <ROLE ID>`", inline: true},
                        {name: "Removerole", value: "`removerole <USER> <ROLE ID>`", inline: true},
                        {name: "Jail", value: "`jail <USER> (optional) <TIME (S/M/H)>`", inline: true},
                        {name: "Setaskchannel", value: "`setaskchannel <CHANNEL ID>`", inline: true},
                        {name: "Answer", value: "`answer <USER ID> <MESSAGE>`", inline: true},
                        {name: "Embedify", value: "`embedify a <MESSAGE> - embedify <MESSAGE>`", inline: true}
                    )

                msg.channel.send(syntaxEmbed);
            }
        }

        // USER COMMANDS ------------------------------------------------------------

        if (command.substring(0, 6) == "wallet")
        {
            const user = msg.mentions.users.first() || msg.author;

            if (currGuild.currencyOn == false)
            {
                msg.channel.send("Please be aware that the currency module is currently disabled. You will not be able to check your balance at this time.");
            }
            else
            {
                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].name === user.id && userDict[i].guild === currGuild.name)
                    {
                        msg.channel.send("This user's current balance is " + userDict[i].currency + " " + `${currGuild.currencyIcon}` + ".")
                        return;
                    }
                }
            } 
        }

        else if (command == "help")
        {
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setTitle("Towa's Help Menu - Prefix: \"" + currGuild.prefix + "\"")
                .addFields(
                    {name: "Wallet", value: ("A command to see how much of the local currency you have. It does not transfer between servers."), inline: true},
                    {name: "Shop", value: ("Opens the shop menu. Pages can be moved between using commands like \"" + currGuild.prefix + "shop 2\"."), inline: true},
                    {name: "Buy", value: ("The command to buy various roles from the shop. Use \"" + currGuild.prefix + "buy 1\" to buy the first role."), inline: true},
                    {name: "___________", value: "_______"},
                    {name: "Avatar", value: ("Checks the avatar of either the author or a pinged user."), inline: true},
                    {name: "Ask", value: ("Sends a message to the moderators anonymously if you have any questions about the server."), inline: true},
                    {name: "Schedule", value: ("Adds an event to a schedule for you. This embed is accessable from any server that Towa is in."), inline: true},
                    {name: "___________", value: "_______"},
                    {name: "Modmail", value: ("Sends a Direct Message to my boss, in the event of any error messages you see or can't figure out. Do not abuse this command."), inline: true},
                    {name: "Ping", value: ("Checks the latency of the bot."), inline: true},
                    {name: "Leaderboard", value:("Posts the top 10 users with the most currency."), inline: true},
                    {name: "___________", value: "_______"},
                    {name: "About", value:("Shows information about Towa and the creator."), inline: true},
                    {name: "Syntax", value: "Shows the proper way to use Towa's commands.", inline: true}
                )

            msg.channel.send(helpEmbed);
        }

        else if (command == "syntax")
        {
            const syntaxEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setTitle("Towa's Syntax Menu - Prefix: \"" + currGuild.prefix + "\"")
                .addField("When you see a command with these \"< >\", those are variables.", "Replace them with the values that will be explained inside.")
                .addFields(
                    {name: "Wallet", value: "```wallet - wallet <@ user>```", inline: true},
                    {name: "Shop", value: "```shop - shop <shop page>```", inline: true},
                    {name: "Buy", value: "```buy <role number>```", inline: true},
                    {name: "___________", value: "_______"},
                    {name: "Avatar", value: "```avatar - avatar <@ user>```", inline: true},
                    {name: "Ask", value: "```ask <text>```", inline: true},
                    {name: "Schedule", value: "```schedule - addschedule <text> - delschedule <entry number> - clearschedule```", inline: true},
                    {name: "___________", value: "_______"},
                    {name: "Modmail", value: "```modmail <text>```", inline: true},
                    {name: "Ping", value: "```ping```", inline: true},
                    {name: "Leaderboard", value: "```leaderboard```", inline: true},
                    {name: "___________", value: "_______"},
                    {name: "About", value: "```about```", inline: true}
                )

            msg.channel.send(syntaxEmbed);
        }

        else if (command.substring(0, 4) == "shop")
        {
            if (shopDict == [] || shopDict == null)
            {
                msg.channel.send("Please set up the shop first by using the populateShop command.");
                return;
            }

            if (currGuild.shopCreated == false)
            {
                msg.channel.send("Please set up the shop first by using the populateShop command.");
            }

            else
            {
                if (currGuild.shopOn == true)
                    {

                            if (command == "shop")
                            {
                                msg.channel.send({embed:currGuild.embedList[0]})
                            }

                            else if (command.substring(5) <= currGuild.embedList.length)
                            {
                                if (command.substring(5) <= 0)
                                {
                                    msg.channel.send("You have entered an invalid shop option. Please try again.");
                                    return;
                                }

                                msg.channel.send({embed:currGuild.embedList[parseInt(command.substring(5) - 1)]})
                            }

                            else
                            {
                                msg.channel.send("You have entered an invalid shop option. Please try again.")
                                return;
                            }
                        
                        
                    }

                else
                {
                    msg.channel.send("Please enable the shop to use it.")
                }
            }
        }

        else if (command.substring(0, 3) == "buy")
        {   
            if (currGuild.shopOn)
            {
                for (i = 0; i < userDict.length; i++)
                {
                    if (userDict[i].name === msg.author.id.toString() && userDict[i].guild == currGuild.name)
                    {
                        try
                        {
                            for (j = 0; j < shopDict.length; j++)  // enter shop find guild
                            {
                                if (shopDict[j].guild == currGuild.name)
                                {
                                    if (msg.guild.member(msg.author.id).roles.cache.get(shopDict[j].contents[parseInt(command.substring(4)) - 1].value.id))
                                    {
                                        msg.channel.send("You already have the " + msg.guild.roles.cache.get(shopDict[j].contents[parseInt(command.substring(4)) - 1].value.id).name + " role.");
                                        return;
                                    }

                                    else
                                    {
                                        if (command.substring(4) <= 0)
                                        {
                                            msg.channel.send("Please enter a valid, non-negative value.");
                                            return;
                                        }

                                        if (userDict[i].currency >= shopDict[j].contents[parseInt(command.substring(4)) - 1].price)
                                        {
                                            let memberUsername = client.users.cache.get(msg.author.id).tag;

                                            userDict[i].currency -= shopDict[j].contents[parseInt(command.substring(4)) - 1].price;
                                            msg.guild.member(msg.author.id).roles.add(shopDict[j].contents[parseInt(command.substring(4)) - 1].value.id);
                                            userDict[i].roleList.push(shopDict[j].contents[parseInt(command.substring(4)) - 1].value.id);

                                            msg.channel.send("The role has been added to your account. Thank you for purchasing the " + msg.guild.roles.cache.get(shopDict[j].contents[parseInt(command.substring(4)) - 1].value.id).name + " role.");
                                            msg.channel.send(memberUsername + ": " + (parseInt(userDict[i].currency) + parseInt(shopDict[j].contents[parseInt(command.substring(4)) - 1].price)) + " " + currGuild.currencyIcon + " --> " + userDict[i].currency+ " " + currGuild.currencyIcon);
                                        }

                                        else
                                        {
                                            msg.channel.send("I'm afraid you don't have enough " + currGuild.currencyIcon + " to purchase the " + msg.guild.roles.cache.get(shopDict[j].contents[parseInt(command.substring(4)) - 1].value.id).name + " role. It costs " + shopDict[j].contents[parseInt(command.substring(4)) - 1].price + currGuild.currencyIcon + " and you have " + userDict[i].currency + currGuild.currencyIcon + ".")
                                            return;
                                        }
                                    }
                                }
                            }
                        }

                        catch 
                        {
                            msg.channel.send("I can't seem to find this entry in the shop.");
                            return;
                        }
                        
                    }
                }
            }

            else
            {
                msg.channel.send("The shop module is currently disabled.");
            }
        }

        else if (command.substring(0, 6) == "avatar")
        {            
            command = command.replace('!', '');

            const user = msg.mentions.users.first() || msg.author;
            const avatarEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setTitle(user.username + "'s Avatar")
                .setImage(user.avatarURL({format: "png", dynamic: true, size: 512}))
            
            msg.channel.send(avatarEmbed);
        }

        else if (command.substring(0, 3) == "ask")
        {
            if (currGuild.askChannel == null)
            {
                msg.channel.send("The Ask function has not been enabled on this server.");
                return;
            }

            msg.delete();

            if (command.substring(8) == "")
            {
                msg.channel.send("You must say something after 'ask' in order to send one.");
                return;
            }

            const askEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setTitle(msg.author.username + " : " + msg.author.id)
                .addField("Question: ", command.substring(4))
                .setTimestamp()

            client.channels.cache.get(currGuild.askChannel).send(askEmbed);
            client.channels.cache.get(currGuild.askChannel).send(msg.author.id)

            msg.channel.send("Your message has been sent.").then(wait =>

            setTimeout(function()
            {
                wait.delete();
            }, 7000)
            )
        }

        else if (command == "messages")
        {
            for (i = 0; i < userDict.length; i++)
            {
                if (userDict[i].name == msg.author.id && userDict[i].guild == currGuild.name)
                {
                    msg.channel.send("Your current message count is " + userDict[i].messages + ".")
                }
            }
        }

        else if (command == "leaderboard")
        {
            var vals = [];

            for (i = 0; i < userDict.length; i++)
            {
                if (userDict[i].guild == currGuild.name)
                {
                    var obj = {num: userDict[i].currency, name: userDict[i].name};
                    vals.push(obj);
                }
            }

            vals = vals.sort((a, b) => (b.num - a.num))

            const leaderboardEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setTitle(msg.guild.name + "'s " + currGuild.currencyIcon + " Leaderboard")
                .setTimestamp()
            
            for (i = 0; i < vals.length && i < 10; i++)
            {
                leaderboardEmbed.addField("# " + (i + 1) + " - ", "<@!" + vals[i].name + "> --- " + parseInt(vals[i].num) + " " + currGuild.currencyIcon)
            }
            
            msg.channel.send(leaderboardEmbed);

            return;
        }

        else if (command == "ping")
        {
            msg.channel.send(`Tick tock! The latency is ${Date.now() - msg.createdTimestamp}ms. API latency is ${Math.round(client.ws.ping)}ms.`)
        }

        else if (command == "about")
        {
            var rn = new Date()
            var rn = rn.getTime()
            const dateObj = new Date(rn - client.uptime)

            const aboutEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setAuthor("GreyMouseDragon#6985")
                .addField("Towa is a Shop managing bot with some moderation capabilities.", "Suggestions and feedback can be sent via modmail, as well as links to SFW artwork of her to add emotes to the help server.", true)
                .addField("Current uptime: ", dateObj)

            msg.channel.send(aboutEmbed);
        }

        else if (command.substring(0, 7) == "modmail")
        {
            if (command.substring(8) == "")
            {
                msg.channel.send("You must say something after 'modmail' in order to send one.");
                return;
            }

            for (i = 0; i < blacklistDict.length; i++)
            {
                if (msg.author.id == blacklistDict[i])
                {
                    msg.delete();
                    msg.channel.send("You have been blacklisted from using the modmail function.");
                    return;
                }
            }

            msg.delete();
            msg.channel.send("Your modmail has been sent.");
            const modmailEmbed = new Discord.MessageEmbed()
                .setColor('#cf98c5')
                .setTitle(msg.author.username)
                .addField("Dear GreyMouseDragon, ", command.substring(8))
                .setTimestamp()
                .setFooter(msg.author.id)
            
            client.users.cache.get("456341235502678031").send(modmailEmbed);
        }

        else if (command == "schedule")
        {
            try
            {
                const scheduleEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle(msg.author.username)
                    .setTimestamp()

                for (i = 0; i < schedulesDict.length; i++)
                {
                    if (schedulesDict[i].user == msg.author.id)
                    {
                        scheduleEmbed.addField("Event: ", schedulesDict[i].content);
                    }
                }

                if (scheduleEmbed != undefined)
                {
                    msg.channel.send(scheduleEmbed);
                }

                msg.delete();
                return;
            }
            catch
            {
                msg.channel.send("I'm afraid that didn't quite work out as planned. Please try again.")
                return;
            }
        }

        else if (command.substring(0, 11) == "addschedule")
        {
            if (command.substring(12) == "")
            {
                msg.channel.send("You must input something in order for this command to work.");
                return;
            }

            var obj = {
                user: msg.author.id,
                guild: msg.guild.id,
                content: command.substring(12)
            }

            schedulesDict.push(obj);

            msg.channel.send("Your schedule has been updated.")
            msg.delete()

            return;
        }

        else if (command.substring(0, 11) == "delschedule")
        {
            for (i = 0; i < schedulesDict.length; i++)
            {
                if (schedulesDict[i].user == msg.author.id)
                {
                    try
                    {
                        schedulesDict.splice(i, 1);

                        msg.channel.send("Your schedule has been updated.")

                        msg.delete()
                        return;
                    }
                    catch
                    {
                        msg.channel.send("It appears there was an error with your input. Use the form ```delschedule 1``` to delete the first entry.")
                        return;
                    }
                }
            }
        }

        else if (command == "clearschedule")
        {
            for (i = 0; i < schedulesDict.length; i++)
            {
                if (schedulesDict[i].user == msg.author.id)
                {
                    schedulesDict.splice(i, 1);
                }
            }

            msg.channel.send("Your schedule has been cleared.")
        }

        // COMMANDS FOR ME -------------------------------------------------------------------------

        else if (command.substring(0, 9) == "blacklist")
        {
            if (msg.author.id == "456341235502678031")
            {
                blacklistDict.push(command.substring(10));

                let blacklistFinished = JSON.stringify(blacklistDict);
                fs.writeFileSync("blacklist.json", blacklistFinished);
            }
        }

        else if (command.substring(0, 7) == "modansr")
        {
            if (msg.author.id == "456341235502678031")
            {
                msg.delete();
                msg.channel.send("Your modmail has been sent.");
                const modmailEmbed = new Discord.MessageEmbed()
                    .setColor('#cf98c5')
                    .setTitle(msg.author.username)
                    .addField("In terms of your modmail,", command.substring(27))
                    .setTimestamp()
                    .setFooter(msg.author.id)
                
                client.users.cache.get(command.substring(8, 26)).send(modmailEmbed);
            }
        }

    }

    let userFinished = JSON.stringify(userDict);
    let shopFinished = JSON.stringify(shopDict);
    let serverFinished = JSON.stringify(serverDict);
    let scheduleFinished = JSON.stringify(schedulesDict);
    let universeFinished = JSON.stringify(uniDict);
    let logsFinished = JSON.stringify(logsDict);
    let unisFinished = JSON.stringify(memuDict);
    let towaunisFinished = JSON.stringify(universeDict);

    fs.writeFileSync("userList.json", userFinished);
    fs.writeFileSync("shopList.json", shopFinished);
    fs.writeFileSync("serverList.json", serverFinished);
    fs.writeFileSync("schedules.json", scheduleFinished);
    fs.writeFileSync("universeslist.json", universeFinished);
    fs.writeFileSync("logs.json", logsFinished);
    fs.writeFileSync("memunilist.json", unisFinished)
    fs.writeFileSync("towaunilist.json", towaunisFinished)
});

client.login("")