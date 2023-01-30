import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';

@Injectable()
export class AppService {
  //подключение к БД
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async getAll() {
    return this.taskRepository.find();
  }

  async getById(id: number) {
    return this.taskRepository.findOneBy({ id }); // const todo = todos.find((t) => t.id === Number(message));
  }

  //create
  async createTask(name: string) {
    const task = await this.taskRepository.create({ name });

    await this.taskRepository.save(task);
    return this.getAll();
  }

  //done
  async doneTask(id: number) {
    const task = await this.getById(id);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    await this.taskRepository.save(task);
    return this.getAll();
  }

  //edit
  async editTask(id: number, name: string) {
    const task = await this.getById(id);
    if (!task) return null;

    task.name = name;
    await this.taskRepository.save(task);
    return this.getAll();
  }

  //remove
  async deleteTask(id: number) {
    const task = await this.getById(id);
    if (!task) return null;

    await this.taskRepository.delete({ id });
    return this.getAll();
  }
}
