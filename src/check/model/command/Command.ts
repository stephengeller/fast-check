import { ICommand } from './ICommand.js';

export interface Command<Model extends object, Real> extends ICommand<Model, Real, void> {}
