import { ValidationResultMessages } from './validate';
import { isArray, isEmpty, flatMapDeep, isString } from 'lodash-es';

function firstMessage(errors?: ValidationResultMessages<any>): string | undefined {
  if (errors === undefined) {
    return undefined;
  }

  if (isArray(errors)) {
    return errors[0];
  }

  const keys = Object.keys(errors);
  const error = keys.length ? errors[keys[0]] : undefined;
  if (error === undefined) {
    return undefined;
  }

  if (isString(error)) {
    return error;
  }

  return firstMessage(error);
}

function allMessages(errors?: ValidationResultMessages<any>): string[] {
  if (errors === undefined) {
    return [];
  }

  if (isArray(errors)) {
    return errors;
  }

  const childMessages = Object.values(errors) as ValidationResultMessages<any>[];
  return flatMapDeep(childMessages, allMessages);
}


export class ValidationResult<T> {
  constructor(protected errors?: T) {}

  first(): string | undefined {
    return firstMessage(this.errors);
  }

  all(): T | undefined {
    return this.errors;
  }

  flattened(): string[] {
    return allMessages(this.errors);
  }

  throwIfFailed(): void {
    if (this.failed()) {
      throw new Error('Validation failed');
    }
  }

  passed(): boolean {
    return isEmpty(this.errors);
  }

  failed(): boolean {
    return !this.passed();
  }
}
