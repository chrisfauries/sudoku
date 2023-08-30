import { Grid, Matrix } from "./grid";
import * as t from "io-ts";
import { isRight } from "fp-ts/Either";
import { AtomEffect } from "recoil";
import { PlayerInputGrid } from "../data";

export interface Data {
  currentGrid?: Grid;
  blanks?: PlayerInputGrid;
  level?: number;
  time?: number;
  available?: Matrix<Array<number>>;
  hint?: boolean;
}
export class LocalStorage {
  private static KEY = "fauries-sudoku";
  private static PLAYER_INPUT_CHECK = t.array(
    t.array(
      t.strict({
        value: t.number,
        center: t.array(t.number),
        corner: t.array(t.number),
      })
    )
  );
  private static GRID_CHECK = t.array(t.array(t.number));
  private static CUBE_CHECK = t.array(t.array(t.array(t.number)));
  public static TYPE_CHECK: t.Type<Data> = t.exact(
    t.partial({
      currentGrid: this.GRID_CHECK,
      blanks: this.PLAYER_INPUT_CHECK,
      available: this.CUBE_CHECK,
      level: t.number,
      time: t.number,
      hint: t.boolean,
    })
  );
  private static DEFAULT_STORED_DATA: {
    [key in keyof Data]: undefined;
  } = {
    currentGrid: undefined,
    available: undefined,
    blanks: undefined,
    level: undefined,
    time: undefined,
    hint: undefined,
  };

  public static get() {
    const json = localStorage.getItem(this.KEY);

    if (!json) {
      return this.DEFAULT_STORED_DATA;
    }

    try {
      return this.decode(JSON.parse(json));
    } catch {
      return this.DEFAULT_STORED_DATA;
    }
  }

  public static has() {
    return !!localStorage.getItem(this.KEY);
  }

  public static set(values: Data) {
    const data = this.get();
    const json = JSON.stringify({ ...data, ...values });
    localStorage.setItem(this.KEY, json);
  }

  public static effect<K extends keyof Data>(
    key: K,
    rest?: Data
  ): AtomEffect<NonNullable<Data[K]>> {
    return ({ onSet }) => {
      onSet((value) => {
        LocalStorage.set({ [key]: value, ...rest });
      });
    };
  }

  private static decode(json: any): Data {
    const result = this.TYPE_CHECK.decode(json);
    if (isRight(result)) {
      return result.right;
    }
    return this.DEFAULT_STORED_DATA;
  }
}
