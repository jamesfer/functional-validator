import {
  RuleMessage,
  makeConstraint,
  Constraint,
  ConstraintOptions,
} from '../make-constraint';
import { isArrayLike } from 'lodash';


const isArrayConstraint: Constraint = value => value == null || Array.isArray(value);
export function array(message: RuleMessage = 'Value must be an array') {
  return makeConstraint({ message, constraint: isArrayConstraint });
}

export type MaxLengthParams = { length: number };
const maxLengthMessage: RuleMessage<MaxLengthParams>
  = (value, options, { length }) => `Value must have a length of at most ${length}`;
const maxLengthConstraint: Constraint<MaxLengthParams>
  = (value, options, { length }) => value == null || !isArrayLike(value) || value.length <= length;
export function maxLength(
  length: number,
  message: RuleMessage<MaxLengthParams> = maxLengthMessage,
) {
  return makeConstraint({ message, constraint: maxLengthConstraint, params: { length } });
}

export type MinLengthParams = { length: number };
const minLengthMessage: RuleMessage<MinLengthParams>
  = (value, options, { length }) => `Value must have a length of at least ${length}`;
const minLengthConstraint: Constraint<MinLengthParams>
  = (value, options, { length }) => value == null || !isArrayLike(value) || value.length >= length;
export function minLength(
  length: number,
  message: RuleMessage<MinLengthParams> = minLengthMessage,
) {
  return makeConstraint({ message, constraint: minLengthConstraint, params: { length } });
}
