import { get, set, merge } from 'lodash';

// sync prop & static prop
export class Store {
  // ts 添加访问修饰符 其实没必要_variableName
  private static _data = {};
  private static readonly watchCallbacks: {
    [key: string]: Array<(value: any) => void>;
  } = {};
  private static readonly hasDefined: { [key: string]: boolean } = {};

  static get data() {
    return this._data;
  }

  static set data(data: any) {
    this._data = data;
  }

  public static update(path: string, value: any) {
    set(this._data, path, value);
  }

  public static merge(data: any) {
    this._data = merge(this._data, data);
  }

  public static get<T extends any>(path: string, defaults?: T): T {
    return get(this._data, path, defaults);
  }

  public static watch(path: string, callback: (value: any) => void) {
    if (!this.watchCallbacks[path]) {
      this.watchCallbacks[path] = [];
    }
    this.watchCallbacks[path].push(callback);

    if (!this.hasDefined[path]) {
      Object.defineProperty(this._data, path, {
        set: newVal => {
          this.watchCallbacks[path].forEach(cb => cb(newVal));
        },
      });
      this.hasDefined[path] = true;
    }
  }
}
