import {
  ConstraintOptions,
  Constraint,
  RuleMessage,
  makeConstraint,
} from '../make-constraint';
import { isNumber, isInteger } from 'lodash-es';

const numberConstraint: Constraint = value => value == null || isNumber(value);
export function number(message: RuleMessage = 'Value must be a number') {
  return makeConstraint({ message, constraint: numberConstraint });
}

const integerConstraint: Constraint = value => value == null || isInteger(value);
export function integer(message: RuleMessage = 'Value must be an integer') {
  return makeConstraint({ message, constraint: integerConstraint });
}


const finiteConstraint: Constraint = value => value == null || isFinite(value);
export function finite(message: RuleMessage = 'Value must be a finite number') {
  return makeConstraint({ message, constraint: finiteConstraint });
}

export type GreaterThanParams = { minimum: number };
const greaterThanMessage: RuleMessage<GreaterThanParams>
  = (value, options, { minimum }) => `Value must be greater than ${minimum}`;
const greaterThanConstraint: Constraint<GreaterThanParams>
  = (value, options, { minimum }) => !isNumber(value) || value > minimum;
export function greaterThan(
  minimum: number,
  message: RuleMessage<GreaterThanParams> = greaterThanMessage,
) {
  return makeConstraint({ message, constraint: greaterThanConstraint, params: { minimum } });
}

export type GreaterEqualToParams = { minimum: number };
const greaterEqualToMessage: RuleMessage<GreaterEqualToParams>
  = (value, options, { minimum }) => `Value must be greater than or equal to ${minimum}`;
const greaterEqualToConstraint: Constraint<GreaterEqualToParams>
  = (value, options, { minimum }) => !isNumber(value) || value >= minimum;
export function greaterEqualTo(
  minimum: number,
  message: RuleMessage<GreaterEqualToParams> = greaterEqualToMessage,
) {
  return makeConstraint({ message, constraint: greaterEqualToConstraint, params: { minimum } });
}

export type LessThanParams = { maximum: number };
const lessThanMessage: RuleMessage<LessThanParams>
  = (value, options, { maximum }) => `Value must be less than ${maximum}`;
const lessThanConstraint: Constraint<LessThanParams>
  = (value, options, { maximum }) => !isNumber(value) || value < maximum;
export function lessThan(maximum: number, message: RuleMessage<LessThanParams> = lessThanMessage) {
  return makeConstraint({ message, constraint: lessThanConstraint, params: { maximum } });
}


export type LessEqualToParams = { maximum: number };
const lessEqualToMessage: RuleMessage<LessEqualToParams>
  = (value, options, { maximum }) => `Value must be less than or equal to ${maximum}`;
const lessEqualToConstraint: Constraint<LessEqualToParams>
  = (value, options, { maximum }) => !isNumber(value) || value <= maximum;
export function lessEqualTo(
  maximum: number,
  message: RuleMessage<LessEqualToParams> = lessEqualToMessage,
) {
  return makeConstraint({ message, constraint: lessEqualToConstraint, params: { maximum } });
}
