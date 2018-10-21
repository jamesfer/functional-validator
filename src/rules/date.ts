import { format, parse, isBefore, isAfter } from 'date-fns';
import { isDate } from 'lodash-es';
import { Constraint, makeConstraint, RuleMessage } from '../make-constraint';

const enableUnicodeTokens = { awareOfUnicodeTokens: true };

function toDate(date: string | Date, formatString: string): Date {
  return isDate(date) ? date : parse(date, formatString, new Date(), enableUnicodeTokens);
}

function toString(date: string | Date, formatString: string): string {
  return isDate(date) ? format(date, formatString, enableUnicodeTokens) : date;
}

export type DateFormatParams = { format: string };
const dateFormatMessage: RuleMessage<DateFormatParams> = (value, options, { format }) => (
  `Value must be a date string in the format ${format}`
);
const dateFormatConstraint: Constraint<DateFormatParams> = (value, options, { format }) => (
  value == null || !isNaN(toDate(value, format).getTime())
);
export function dateFormat(
  format: string,
  message: RuleMessage<DateFormatParams> = dateFormatMessage,
) {
  return makeConstraint({ message, constraint: dateFormatConstraint, params: { format } });
}

export type BeforeParams = { date: Date | string, format: string };
const beforeMessage: RuleMessage<BeforeParams> = (value, options, { date, format }) => (
  `Value must be before ${toString(date, format)}`
);
const beforeConstraint: Constraint<BeforeParams> = (value, options, { date, format }) => (
  value == null || isBefore(toDate(value, format), toDate(date, format))
);
export function before(
  date: Date | string,
  format: string,
  message: RuleMessage<BeforeParams> = beforeMessage,
) {
  return makeConstraint({ message, constraint: beforeConstraint, params: { date, format } });
}

export type AfterParams = { date: Date | string, format: string };
const afterMessage: RuleMessage<AfterParams> = (value, options, { date, format }) => (
  `Value must be after ${toString(date, format)}`
);
const afterConstraint: Constraint<AfterParams> = (value, options, { date, format }) => (
  value == null || isAfter(toDate(value, format), toDate(date, format))
);

export function after(
  date: Date | string,
  format: string,
  message: RuleMessage<BeforeParams> = afterMessage,
) {
  return makeConstraint({ message, constraint: afterConstraint, params: { date, format } });
}
