import * as Discord from 'discord.js';
import AbstractSubscription from '../api/subscription/AbstractSubscription';
import AGUser from '../api/user/AGUser';
import StringUtil from '../api/utils/StringUtil';
import WordSystem from '../system/WordSystem';

export default class WordSubscription extends AbstractSubscription {
  constructor() {
    super({
      id: 'Word',
    });
  }

  load(): void {
    this.bot.getClient().on('message', async (message) => {
      if (message.channel.type !== 'text') return;
      if (message.type !== 'DEFAULT') return;
      if (message.guild.id !== this.bot.getConfig().getConfig().bot.serverId) return;
      if (message.channel.id !== this.bot.getConfig().getConfig().channels.word_tr) return;
      if (message.author.bot) return;
      if (message.content[0] === '.') return;
      const allPrefix = Object.assign([], this.getBot().getConfig().getConfig().bot.prefix);
      allPrefix.push(`<@!${this.bot.getClient().user.id}> `);
      let prefix = null;
      for (const thisPrefix of allPrefix) {
        if (message.content.startsWith(thisPrefix)) prefix = thisPrefix;
      }
      if (prefix) return;
      if (!this.bot.getConfig().getConfig().word.status) {
        await message.delete();
        return;
      }
      if (!WordSystem.isStatus()) return;
      if (WordSystem.isTyping()) {
        await message.delete();
        return;
      }
      let messageLower: string = message.content.toLocaleLowerCase('tr-TR');
      let lastCharacter = messageLower[messageLower.length - 1];
      const configData = this.bot.getConfig().getWordData();
      if (!configData) return;
      if (configData.lastUserId !== '' && message.author.id === configData.lastUserId) {
        message.delete();
        return;
      }
      if (lastCharacter.includes('ğ') && this.bot.getConfig().getWords('used').length < configData.limitFinishCount) {
        message.delete().then((message) =>
          message.channel.send(
            new Discord.MessageEmbed({
              description: `\`${StringUtil.capitalize(messageLower)}\` kelimesi \`${lastCharacter.toLocaleUpperCase(
                'tr-TR'
              )}\` ile bittiği için şu anda kullanamazsın! Biraz oyun devam etsin fındık, sakin ol!`,
              color: '#8a8584',
            })
          )
        );
        return;
      }
      if (WordSystem.control(messageLower)) {
        if (
          configData.lastCharacter !== '' &&
          messageLower[0] !== configData.lastCharacter.toLocaleLowerCase('tr-TR')
        ) {
          message.delete().then((message) =>
            message.channel
              .send(
                new Discord.MessageEmbed({
                  description: `\`${StringUtil.capitalize(
                    messageLower
                  )}\` kelimesi \`${configData.lastCharacter.toUpperCase()}\` ile başlamıyor!`,
                  color: '#8a8584',
                })
              )
              .then((message) => message.delete({ timeout: 3500 }))
          );
          return;
        }
        WordSystem.changeTyping(true);
        if (WordSystem.controlUsed(messageLower)) {
          WordSystem.changeTyping(false);
          message.delete().then((message) =>
            message.channel
              .send(
                new Discord.MessageEmbed({
                  description: `\`${StringUtil.capitalize(messageLower)}\` kelimesi daha önce kullanılmış!`,
                  color: '#b52d0b',
                })
              )
              .then((message) => message.delete({ timeout: 3500 }))
          );
          return;
        }
        WordSystem.pushUsed(messageLower);
        configData.lastCharacter = lastCharacter;
        configData.lastUserId = message.author.id;
        const agUser = message.author as AGUser;
        try {
          if (!agUser.isCustomDataLoaded()) await agUser.loadCustomData();
        } catch (error) {
          message.delete().then((message) =>
            message.channel.send(
              new Discord.MessageEmbed({
                description: `Bot sisteminde beklenmeyen bir hata oluştu. En kısa sürede çözülecektir!`,
                color: '#b52d0b',
              })
            )
          );
          WordSystem.changeTyping(true);
          return;
        }
        agUser.getCustomData().wordPoint = agUser.getCustomData().wordPoint + 1; //(lastCharacter.includes('ğ') ? 16 : 1);
        agUser
          .saveCustomData()
          .then(() => {
            this.bot.getConfig().saveAll((error: Error) => {
              if (error) {
                message.delete().then((message) =>
                  message.channel.send(
                    new Discord.MessageEmbed({
                      description: `Bot sisteminde beklenmeyen bir hata oluştu. En kısa sürede çözülecektir!`,
                      color: '#b52d0b',
                    })
                  )
                );
                WordSystem.changeTyping(true);
                return;
              }
              message.react('✅');
              WordSystem.changeTyping(false);
            });
          })
          .catch(() => {
            message.delete().then((message) =>
              message.channel.send(
                new Discord.MessageEmbed({
                  description: `Bot sisteminde beklenmeyen bir hata oluştu. En kısa sürede çözülecektir!`,
                  color: '#b52d0b',
                })
              )
            );
            WordSystem.changeTyping(true);
            return;
          });
        if (lastCharacter.includes('ğ')) {
          WordSystem.reset((error: Error) => {
            if (error) return;
            message.channel.send(
              new Discord.MessageEmbed({
                description: `\`Ğ\` ile biten bir kelime bulduğun için oyun yeniden başlatıldı.\n\`${configData.lastCharacter}\` ile kelime türetmeye devam edebilirsiniz.`,
                color: '#29c458',
              })
            );
          });
        }
      } else {
        message.delete().then((message) =>
          message.channel
            .send(
              new Discord.MessageEmbed({
                description: `\`${StringUtil.capitalize(messageLower)}\` TDK'da bulunmamakta!`,
                color: '#b52d0b',
              })
            )
            .then((message) => message.delete({ timeout: 3500 }))
        );
      }
    });
  }

  close(): void {}
}
