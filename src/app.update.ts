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

const todos = [
  {
    id: 1,
    name: 'Buy goods',
    isCompleted: false,
  },
  {
    id: 2,
    name: 'Go to walk',
    isCompleted: false,
  },
  {
    id: 3,
    name: 'Travel',
    isCompleted: true,
  },
];

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

  @Hears('📃 Список дел')
  async listTask(ctx: IContext) {
    // const isCompleted = (state: boolean) => (state ? '✅ ' : '🔘');
    // const todoList = todos.map(
    // );
    // const showList = `Твой список задач: \n\n ${todoList.join(' ')}`;

    await ctx.reply(showList(todos));
  }

  @Hears('✅ Завершить')
  async doneTask(ctx: IContext) {
    await ctx.reply('Напиши ID задачи:');
    ctx.session.type = 'done';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: IContext) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todo = todos.find((t) => t.id === Number(message));

      //task no exist
      if (!todo) {
        await ctx.deleteMessage();
        await ctx.reply('Задача с таким id не найдена!');
        return;
      }

      todo.isCompleted = !todo.isCompleted;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await ctx.reply(showList(todos));
    }
  }
}
