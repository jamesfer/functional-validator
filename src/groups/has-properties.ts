import pMap from 'p-map';
import { isUndefined, omitBy, zipObject } from 'lodash-es';
import { ObjectMessageMap, ObjectValidatorMap, runConstraints } from '../validate';
import { ConstraintOptions, GroupConstraint } from '../make-constraint';
import { Dictionary } from '../utils';

function runPropertyConstraint<T extends ObjectValidatorMap<any>>(
  value: any,
  constraints: T,
  options: ConstraintOptions,
): (key: string) => Promise<any> {
  return (key) => {
    const propertyOptions = {
      ...options,
      key,
      keyPath: [...options.keyPath, key],
      parent: value,
    };
    return runConstraints(value[key], constraints[key], propertyOptions);
  };
}

function runObjectConstraints<T extends ObjectValidatorMap<any>>(
  value: Dictionary<any>,
  constraints: T,
  options: ConstraintOptions,
): Promise<ObjectMessageMap<T> | undefined> {
  const keys = Object.keys(constraints);
  return pMap(keys, runPropertyConstraint(value, constraints, options))
    .then(results => (
      results.every(isUndefined)
        ? undefined
        : omitBy(zipObject(keys, results), isUndefined) as ObjectMessageMap<T>
    ));
}

export function hasProperties<T extends ObjectValidatorMap<any>>(
  constraints: T,
): GroupConstraint<ObjectMessageMap<T> | undefined> {
  return (value: any, options: ConstraintOptions) => {
    if (value === null || typeof value !== 'object') {
      return Promise.resolve(undefined);
    }
    return runObjectConstraints(value, constraints, options);
  };
}
