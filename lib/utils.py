import discord
from discord.ext import commands

import datetime


class Typing:
    def template_embed(self, ctx, title: str = "", description: str = ""):
        embed = discord.Embed(
            color=0xFFB0CF, timestamp=datetime.datetime.utcnow(), title=title, description=description)
        embed.set_footer(text=ctx.author.name,
                         icon_url=ctx.author.avatar_url)
        return embed
