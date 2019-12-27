import 'reflect-metadata';
import { Store } from './store';

export const configValue = (
  path?: string,
  defaultValue?: any,
): PropertyDecorator => {
  return (target: any, propertyName: string | symbol) => {
    const attributeName = propertyName as string;
    const configPath = path || attributeName;

    Store.watch(configPath, v => {
      if (v !== void 0) {
        target[attributeName] = v;
      } else if (defaultValue !== void 0) {
        target[attributeName] = defaultValue;
      }
    });
    const value = Store.get(configPath, defaultValue);
    if (value !== void 0) {
      target[attributeName] = value;
    }
  };
};
