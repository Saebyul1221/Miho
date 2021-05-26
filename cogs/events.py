import discord
from discord.ext import commands

class Events(commands.Cog, name="이벤트"):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        print(self.bot.user)
        print(self.bot.user.id)
        print("Bot is ready.")

def setup(bot):
    bot.add_cog(Events(bot))
