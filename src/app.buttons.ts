import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.keyboard(
    [
      Markup.button.callback('✏️ Редактировать', 'edit'),
      Markup.button.callback('❌ Удалить', 'delete'),
      Markup.button.callback('📃 Список дел', 'list'),
    ],
    {
      columns: 2,
    },
  ).resize();
}
