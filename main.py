import discord
from discord.ext import commands

from lib import config

bot = commands.Bot(
    command_prefix="미호야 ",
    help_command=None,
    intents=discord.Intents.all(),
    chunk_guilds_at_startup=True,
)

def load_modules(bot):
    failed = []
    exts = [
        "cogs.general",
        "cogs.events",
    ]

    for ext in exts:
        try:
            bot.load_extension(ext)
        except Exception as error:
            print(f"{error.__class__.__name__}: {error}")
            failed.append(ext)

    return failed


load_modules(bot)
bot.run(config.bot_token)
