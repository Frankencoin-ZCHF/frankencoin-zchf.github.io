import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const dateFormatter = (timestamp) => {
  const timestampSeconds = Number(timestamp) * 1000;
  const date = dayjs(timestampSeconds);

  return {
    isExpired: date.isBefore(),
    isValid: date.isValid(),
    formatted: date.format('YYYY-MM-DD'),
    remaining: date.fromNow(true),
    timestamp: timestampSeconds,
  };
};

export const durationFormatter = (timestamp) => {
  const duration = dayjs
    .duration(timestamp * 1000000000000000000, 'seconds')
    .humanize(false);

  return timestamp > 0 ? duration : '-';
};
