import { Constraint, makeConstraint, RuleMessage, ConstraintOptions } from '../make-constraint';
import isString from 'lodash-es/isString';

const stringConstraint: Constraint = value => value == null || isString(value);
export function string(message: RuleMessage = 'Value must be a string') {
  return makeConstraint({ message, constraint: stringConstraint });
}

export type StartsWithParams = { prefix: string };
const startsWithMessage: RuleMessage<StartsWithParams>
  = (value, options, { prefix }) => `Value must start with ${prefix}`;
const startsWithConstraint: Constraint<StartsWithParams>
  = (value, options, { prefix }) => !isString(value) || value.startsWith(prefix);
export function startsWith(
  prefix: string,
  message: RuleMessage<StartsWithParams> = startsWithMessage,
) {
  return makeConstraint({ message, constraint: startsWithConstraint, params: { prefix } });
}

export type EndsWithParams = { prefix: string };
const endsWithMessage: RuleMessage<EndsWithParams>
  = (value, options, { prefix }) => `Value must end with ${prefix}`;
const endsWithConstraint: Constraint<EndsWithParams>
  = (value, options, { prefix }) => !isString(value) || value.endsWith(prefix);
export function endsWith(prefix: string, message: RuleMessage<EndsWithParams> = endsWithMessage) {
  return makeConstraint({ message, constraint: endsWithConstraint, params: { prefix } });
}

export type MatchesParams = { pattern: RegExp };
const matchesMessage: RuleMessage<MatchesParams>
  = (value, options, { pattern }) => `Value must match ${pattern.toString().substring(1, -1)}`;
const matchesConstraint: Constraint<MatchesParams>
  = (value, options, { pattern }) => !isString(value) || pattern.test(value);
export function matches(pattern: RegExp, message: RuleMessage<MatchesParams> = matchesMessage) {
  return makeConstraint({ message, constraint: matchesConstraint, params: { pattern } });
}
