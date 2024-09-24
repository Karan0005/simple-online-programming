import moment from 'moment';
import { DateProcessor } from './shared';

describe('shared', () => {
    it('Should success, validating get full year method', () => {
        const fullYear: number = moment(new Date()).utc().year();
        expect(DateProcessor.GetFullYear()).toEqual(fullYear);
    });
});
