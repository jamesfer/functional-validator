import pMap from 'p-map';
import { isArrayLike } from 'lodash-es';
import { InternalConstraint, GroupConstraint, ConstraintOptions } from '../make-constraint';
import { runConstraints } from '../validate';

export function hasElements<T = string[]>(
  constraints: InternalConstraint[] | GroupConstraint<T>,
): GroupConstraint<(T | undefined)[]> {
  return (values, options) => {
    if (!isArrayLike(values)) {
      return undefined;
    }

    const childOptions: ConstraintOptions = { ...options, parent: values };
    // Need to use Array.from to support all array like objects
    return pMap(Array.from(values), (value, index) => {
      const key = index.toString();
      return runConstraints(value, constraints, {
        ...childOptions,
        key,
        keyPath: [...childOptions.keyPath, key],
      });
    });
  };
}
