import moment from 'moment';
import { BaseMessage, DateTimeTypeEnum } from '../shared';

export const DateProcessor = {
    GetFullYear: (): number => {
        return moment(new Date()).utc().year();
    },
    IsDateFormatCorrect: (date: string | Date): boolean => {
        return moment(date, 'YYYY-MM-DD', true).isValid();
    },
    Date: (date: string): string => {
        return moment(date).utc().format('YYYY-MM-DD');
    },
    Time: (date: string): string => {
        return moment(date).utc().format('HH:mm:ssZ');
    },
    FormatDate: (date: string | Date): string => {
        return moment(date).format('YYYY-MM-DD');
    },
    DateTime: (date?: string | Date | number): Date => {
        if (date) {
            return moment(date).utc().toDate();
        } else {
            return moment(new Date()).utc().toDate();
        }
    },
    FutureDateTimeStamp: (dateTimeType: DateTimeTypeEnum, extendTo: number): Date => {
        switch (dateTimeType) {
            case DateTimeTypeEnum.SECONDS: {
                return moment(new Date()).utc().add(extendTo, DateTimeTypeEnum.SECONDS).toDate();
            }
            case DateTimeTypeEnum.MINUTES: {
                return moment(new Date()).utc().add(extendTo, DateTimeTypeEnum.MINUTES).toDate();
            }
            case DateTimeTypeEnum.DAYS: {
                return moment(new Date()).utc().add(extendTo, DateTimeTypeEnum.DAYS).toDate();
            }
            case DateTimeTypeEnum.MONTHS: {
                return moment(new Date()).utc().add(extendTo, DateTimeTypeEnum.MONTHS).toDate();
            }
            case DateTimeTypeEnum.YEARS: {
                return moment(new Date()).utc().add(extendTo, DateTimeTypeEnum.YEARS).toDate();
            }

            default:
                throw new Error(BaseMessage.Error.InvalidInput);
        }
    },
    PastDateTimeStamp: (dateTimeType: DateTimeTypeEnum, reduceTo: number): Date => {
        switch (dateTimeType) {
            case DateTimeTypeEnum.SECONDS: {
                return moment(new Date())
                    .utc()
                    .subtract(reduceTo, DateTimeTypeEnum.SECONDS)
                    .toDate();
            }
            case DateTimeTypeEnum.MINUTES: {
                return moment(new Date())
                    .utc()
                    .subtract(reduceTo, DateTimeTypeEnum.MINUTES)
                    .toDate();
            }
            case DateTimeTypeEnum.DAYS: {
                return moment(new Date()).utc().subtract(reduceTo, DateTimeTypeEnum.DAYS).toDate();
            }
            case DateTimeTypeEnum.MONTHS: {
                return moment(new Date())
                    .utc()
                    .subtract(reduceTo, DateTimeTypeEnum.MONTHS)
                    .toDate();
            }
            case DateTimeTypeEnum.YEARS: {
                return moment(new Date()).utc().subtract(reduceTo, DateTimeTypeEnum.YEARS).toDate();
            }

            default:
                throw new Error(BaseMessage.Error.InvalidInput);
        }
    },
    GetDateTimeDifference(dateTimeType: DateTimeTypeEnum, firstDate: Date, secondDate: Date) {
        switch (dateTimeType) {
            case DateTimeTypeEnum.SECONDS: {
                return moment(firstDate).diff(secondDate, DateTimeTypeEnum.SECONDS);
            }
            case DateTimeTypeEnum.MINUTES: {
                return moment(firstDate).diff(secondDate, DateTimeTypeEnum.MINUTES);
            }
            case DateTimeTypeEnum.DAYS: {
                return moment(firstDate).diff(secondDate, DateTimeTypeEnum.DAYS);
            }
            case DateTimeTypeEnum.YEARS: {
                return moment(firstDate).diff(secondDate, DateTimeTypeEnum.YEARS);
            }

            default:
                throw new Error(BaseMessage.Error.InvalidInput);
        }
    },
    GetNiceDateTimeFormat(input: Date) {
        const messageTime = moment.utc(input).local();
        const currentTime = moment().local();

        const diffInSeconds = currentTime.diff(messageTime, 'seconds');

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            return moment.duration(diffInSeconds, 'seconds').humanize() + ' ago';
        } else if (currentTime.isSame(messageTime, 'day')) {
            return messageTime.format('h:mm A');
        } else if (currentTime.isSame(messageTime, 'year')) {
            return messageTime.format('MMMM D [at] h:mm A');
        } else {
            return messageTime.format('MMMM D, YYYY [at] h:mm A');
        }
    },
    GetDateTimeAgo(input: Date) {
        const localDateTime: Date = moment().local().toDate();
        const inputLocalDateTime: Date = moment.utc(input).local().toDate();
        const timeDifferenceInSeconds = Math.floor(
            (localDateTime.getTime() - inputLocalDateTime.getTime()) / 1000
        );

        const timeUnits = [
            { unit: 'year', divisor: 31536000 },
            { unit: 'month', divisor: 2592000 },
            { unit: 'day', divisor: 86400 },
            { unit: 'hr', divisor: 3600 },
            { unit: 'min', divisor: 60 },
            { unit: 'sec', divisor: 1 }
        ];

        for (const unit of timeUnits) {
            if (timeDifferenceInSeconds >= unit.divisor) {
                const count = Math.floor(timeDifferenceInSeconds / unit.divisor);
                return `${count} ${pluralize(unit.unit, count)} ago`;
            }
        }

        return 'just now';
    },

    GetDateTimeSchedule(date: string, time: string) {
        const dateTime = moment(`${date}T${time}`);
        return dateTime.utc().toDate();
    }
};

function pluralize(word: string, count: number): string {
    return count === 1 ? word : `${word}s`;
}
