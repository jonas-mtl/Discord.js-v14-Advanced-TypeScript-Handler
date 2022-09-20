export class TimestampGenerator {
  constructor() {}

  public timeToDate(inputTime: string) {
    const timeType = inputTime.match(/[a-zA-Z]+/g);
    const time = inputTime.match(/\d+/g);
    switch (timeType![0].toLowerCase().replaceAll(' ', '')) {
      case 'ms':
      case 'millisecond':
      case 'milliseconds': {
        return Date.now() + parseInt(time![0]);
      }
      case 's':
      case 'second':
      case 'seconds': {
        return Date.now() + parseInt(time![0]) * 1000;
      }
      case 'min':
      case 'minute':
      case 'minutes': {
        return Date.now() + parseInt(time![0]) * 60000;
      }
      case 'h':
      case 'hour':
      case 'hours': {
        return Date.now() + parseInt(time![0]) * 3600000;
      }
      case 'd':
      case 'day':
      case 'days': {
        return Date.now() + parseInt(time![0]) * 86000000;
      }
      case 'w':
      case 'week':
      case 'weeks': {
        return Date.now() + parseInt(time![0]) * 86000000;
      }
      case 'm':
      case 'month':
      case 'months': {
        return Date.now() + parseInt(time![0]) * 604800000;
      }
      case 'y':
      case 'year':
      case 'years': {
        return Date.now() + parseInt(time![0]) * 31540000000;
      }
      default: {
        return 0;
      }
    }
  }
}
