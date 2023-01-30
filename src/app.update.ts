import { AppService } from './app.service';
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { IContext } from './context.interface';
import { actionButtons } from './app.buttons';
import { showList } from './utils/app.utils';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<IContext>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: IContext) {
    await ctx.reply('Hi! Friend👋🏻');
    await ctx.reply('Что ты хочешь сделать?', actionButtons()); //replyWithHtml -  дизайн
  }

  @Hears('⚡️ Создать задачу')
  async createTask(ctx: IContext) {
    ctx.session.type = 'create';
    await ctx.reply('Опиши задачу: ');
  }

  @Hears('📃 Список задач')
  async listTask(ctx: IContext) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('✅ Завершить')
  async editTask(ctx: IContext) {
    ctx.session.type = 'done';
    await ctx.deleteMessage(); //удаление предыдущего сообщения
    await ctx.reply('Напиши ID задачи:');
  }

  @Hears('✏️ Редактировать')
  async doneTask(ctx: IContext) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши ID и новое название задачи: \n\n' +
        'В формате - <b>1 | Новое название</b>',
    );
  }

  @Hears('❌ Удалить')
  async deleteTask(ctx: IContext) {
    ctx.session.type = 'remove';
    await ctx.deleteMessage();
    await ctx.reply('Напиши ID задачи:');
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: IContext) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message));

      //task no exist
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задача с таким id не найдена!');
        return;
      }

      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split(' | ');
      const todos = await this.appService.editTask(Number(taskId), taskName);

      //task no exist
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задача с таким id не найдена!');
        return;
      }

      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'remove') {
      const todos = await this.appService.deleteTask(Number(message));

      //task no exist
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задача с таким id не найдена!');
        return;
      }

      await ctx.reply(showList(todos));
    }
  }
}
