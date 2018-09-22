import { ObjectMessageMap, ObjectValidatorMap, runConstraints } from '../validate';
import { ConstraintOptions } from '../make-constraint';
import { Dictionary } from 'lodash';

function runPropertyConstraints<T extends ObjectValidatorMap<any>>(
  resultMap: ObjectMessageMap<T>,
  name: string,
  value: any,
  constraints: any,
  options: ConstraintOptions,
): boolean {
  const result = runConstraints(value, constraints, options);
  if (result !== undefined) {
    resultMap[name] = result as any;
    return false;
  }
  return true;
}

function runObjectConstraints<T extends ObjectValidatorMap<any>>(
  constraints: T,
  value: Dictionary<any>,
  options: ConstraintOptions,
): ObjectMessageMap<T> | undefined {
  let allConstraintsPassed = true;
  const resultMap = Object.keys(constraints).reduce<ObjectMessageMap<T>>(
    (resultMap, key) => {
      const propertyOptions = {
        ...options,
        key,
        keyPath: [...options.keyPath, key],
        parent: value,
      };

      const result = runConstraints(value[key], constraints[key], propertyOptions);
      if (result !== undefined) {
        resultMap[key] = result as any;
        allConstraintsPassed = false;
      }

      return resultMap;
    },
    {},
  );
  return allConstraintsPassed ? undefined : resultMap;
}

export function hasProperties<T extends ObjectValidatorMap<any>>(
  constraints: T,
): (...args: any[]) => ObjectMessageMap<T> | undefined {
  return (value: any, options: ConstraintOptions): ObjectMessageMap<T> | undefined => {
    if (value === null || typeof value !== 'object') {
      return undefined;
    }
    return runObjectConstraints(constraints, value, options);
  };
}
