import { InternalConstraint, GroupConstraint, ConstraintOptions } from '../make-constraint';
import { runConstraints } from '../validate';
import { isArrayLike } from 'lodash-es';

export function hasElements<T = string[]>(
  constraints: InternalConstraint[] | GroupConstraint<T>,
): GroupConstraint<(T | undefined)[]> {
  return (value, options) => {
    const childOptions: ConstraintOptions = {
      ...options,
      parent: value,
    };
    if (isArrayLike(value)) {
      // Need to use a normal for loop to support all array like objects
      const messages: (T | undefined)[] = Array(value.length);
      for (let i = 0; i < messages.length; i += 1) {
        const key = i + '';
        messages[i] = runConstraints(value[i], constraints, {
          ...childOptions,
          key,
          keyPath: [...childOptions.keyPath, key],
        });
      }
      return messages;
    }
  };
}
