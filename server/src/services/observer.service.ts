import { appendFile } from "fs";
import { resolve } from "path";

// PATTERN: Observer

export interface IObserver {
  update(data: any): void;
}

export class Observer implements IObserver {
  public update(data: any): void {
    appendFile(resolve(__dirname, "../data/data.log"), data, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}
