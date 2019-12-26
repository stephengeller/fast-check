import { ICommand } from './ICommand.js';

export interface AsyncCommand<Model extends object, Real, CheckAsync extends boolean = false>
  extends ICommand<Model, Real, Promise<void>, CheckAsync> {}
