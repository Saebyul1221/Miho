import discord
from discord.ext import commands

from lib.utils import Typing


class General(commands.Cog, name="일반"):
    def __init__(self, client):
        self.client = client
        self.typing = Typing()

    @commands.command(name="핑", aliases=["레이턴시"])
    async def _ping(self, ctx):
        latency = round(self.client.latency * 1000)
        embed = self.typing.template_embed(
            ctx=ctx, description=f"**현재 미호의 핑이에요!**\n\n봇 지연시간: `{latency}ms`")
        await ctx.send(embed=embed)


def setup(client):
    client.add_cog(General(client))
