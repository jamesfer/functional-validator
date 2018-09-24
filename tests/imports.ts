import { mapValues, isFunction, isObjectLike, omit } from 'lodash-es';
import * as rules from '../src/rules';
import * as groups from '../src/groups';
/* tslint:disable-next-line import-name */
import defaultImport, * as starImport from '../dist/index';
const requireImport = require('../dist/index');

function serializeObject(object: any): any {
  return mapValues(object, (value) => {
    if (isObjectLike(value)) {
      return serializeObject(value);
    }

    return isFunction(value) ? `[Function ${value.name}]` : value;
  });
}

describe('export styles', () => {
  const serialRules = serializeObject(rules);
  const serialGroups = serializeObject(groups);
  const serialDefaultImport = serializeObject(defaultImport);
  const serialStarImport = serializeObject(starImport);
  const serialRequireImport = serializeObject(requireImport);

  it('should contain all rules', () => {
    expect(serialDefaultImport).toMatchObject(serialRules);
    expect(serialStarImport).toMatchObject(serialRules);
    expect(serialRequireImport).toMatchObject(serialRules);
  });

  it('should have a rule property that contains all rules', () => {
    expect(serialDefaultImport.rules).toEqual(serialRules);
    expect(serialStarImport.rules).toEqual(serialRules);
    expect(serialRequireImport.rules).toEqual(serialRules);
  });

  it('should contain all groups', () => {
    expect(serialDefaultImport).toMatchObject(serialGroups);
    expect(serialStarImport).toMatchObject(serialGroups);
    expect(serialRequireImport).toMatchObject(serialGroups);
  });

  it('should contain all groups', () => {
    expect(serialDefaultImport.groups).toEqual(serialGroups);
    expect(serialStarImport.groups).toEqual(serialGroups);
    expect(serialRequireImport.groups).toEqual(serialGroups);
  });

  it('all export styles should be equal', () => {
    expect(serialDefaultImport).toEqual(omit(serialStarImport, 'default'));
    expect(serialDefaultImport).toEqual(omit(serialRequireImport, 'default'));
  });
});


