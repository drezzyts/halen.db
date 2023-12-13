import errors from '../constants/errors.json';

export default class HalenError extends Error {
  public constructor(public type: keyof typeof errors, complement?: string) {
    super(complement ? errors[type] + " " + complement : errors[type]);
  }
}