import { AppService } from './app.service';
import { Hears, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { actionButtons } from './app.buttons';

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
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    // console.log(ctx);
    await ctx.reply('Hi! Friend👋🏻');
    await ctx.reply('Что ты хочешь сделать?', actionButtons()); //replyWithHtml -  дизайн
  }

  @Hears('📃 Список дел')
  async getAll(ctx: Context) {
    return ctx.reply(
      `${todos.map((todo) =>
        todo.isCompleted ? '✅' : '🔘' + ' ' + todo.name,
      )}`,
    );
  }
}
