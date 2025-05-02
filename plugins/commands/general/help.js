const config = {
    name: "help",
    aliases: ["cmds", "commands"],
    version: "1.0.3",
    description: "Show all commands or command details",
    usage: "[command] (optional)",
    credits: "XaviaTeam/Liane/coffee"
};

function getCommandName(commandName) {
    if (global.plugins.commandsAliases.has(commandName)) {
        return commandName;
    }
    return Array.from(global.plugins.commandsAliases).find(([, aliases]) => aliases.includes(commandName))?.[0] || null;
}

async function onCall({ message, args, userPermissions, prefix }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();

    if (!commandName) {
        const language = data?.thread?.data?.language || global.config.LANGUAGE || 'en_US';
        const commands = {};

        for (const [key, value] of commandsConfig.entries()) {
            // Check for command visibility and permissions
            if (value.isHidden || (value.isAbsolute && !global.config?.ABSOLUTES.includes(message.senderID)) || !value.permissions?.some(p => userPermissions.includes(p))) {
                continue;
            }
            const category = commands[value.category] || (commands[value.category] = []);
            category.push(`- ${value._name?.[language] || key}`);
        }

        // Automatically group by categories but without enforcing any particular order
        const commandList = Object.keys(commands)
            .map(category => `
╭─╼━━━━━━━━╾─╮
│  ${category}
│ ${commands[category].join("\n│ ")}
╰─━━━━━━━━━╾─╯`)
            .join("");

        return message.reply(`
━━━━━━━━━━━━━━━━
𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
${commandList}
Chat -𝚑𝚎𝚕𝚙 <command name>
𝚃𝚘 𝚜𝚎𝚎 𝚑𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎 
𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.

𝙴𝚡𝚊𝚖𝚙𝚕𝚎: .help gemini
━━━━━━━━━━━━━━━━
`);
    }

    const command = commandsConfig.get(getCommandName(commandName));
    if (!command || command.isHidden || (command.isAbsolute && !global.config?.ABSOLUTES.includes(message.senderID)) || !command.permissions.some(p => userPermissions.includes(p))) {
        return message.reply(`Command ${commandName} does not exist or you do not have permission to access it.`);
    }

    message.reply(`
━━━━━━━━━━━━━━━━
𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${command.name}
𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${command.description || 'No description provided.'}
𝚄𝚜𝚊𝚐𝚎: ${prefix}${commandName} ${command.usage || ''}
━━━━━━━━━━━━━━━━
    `.replace(/^ +/gm, ''));
}

export default {
    config,
    onCall
};
