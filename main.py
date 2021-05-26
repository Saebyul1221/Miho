import discord
from discord.ext import commands

from lib import config

intents = discord.Intents(
    guilds=True,
    members=True,
    messages=True,
    reactions=True,
    typing=True
)
client = commands.Bot(
    command_prefix="미호야 ",
    help_command=None,
    intents=intents
)


@client.event
async def on_ready():
    print("Bot is ready")


def load_modules(client):
    failed = []
    exts = [
        "cogs.general"
    ]

    for ext in exts:
        try:
            client.load_extension(ext)
        except Exception as error:
            print(f"{error.__class__.__name__}: {error}")
            failed.append(ext)

    return failed


load_modules(client)
client.run(config.bot_token)
