import { RandomValueTypeEnum } from '@full-stack-project/shared';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';

const numbers = '0123456789';
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
const specialChars = '#!&@';
const mixedString = numbers + lowerCaseAlphabets + upperCaseAlphabets + specialChars;

export const RandomValueFactory = (
    valueType: RandomValueTypeEnum,
    length = 5
): string | number | null => {
    let result = '';
    switch (valueType) {
        case RandomValueTypeEnum.NUMBER: {
            while (result.length < length) {
                const charIndex = crypto.randomInt(0, numbers.length);
                if (result.length === 0 && numbers[charIndex] === '0') {
                    continue;
                }
                result += numbers[charIndex];
            }

            return parseInt(result);
        }
        case RandomValueTypeEnum.LOWERCASE_STRING: {
            while (result.length < length) {
                const charIndex = crypto.randomInt(0, lowerCaseAlphabets.length);
                if (result.length === 0 && lowerCaseAlphabets[charIndex] === '0') {
                    continue;
                }
                result += lowerCaseAlphabets[charIndex];
            }

            return result;
        }
        case RandomValueTypeEnum.UPPERCASE_STRING: {
            while (result.length < length) {
                const charIndex = crypto.randomInt(0, upperCaseAlphabets.length);
                if (result.length === 0 && upperCaseAlphabets[charIndex] === '0') {
                    continue;
                }
                result += upperCaseAlphabets[charIndex];
            }

            return result;
        }
        case RandomValueTypeEnum.MIXED_STRING: {
            while (result.length < length) {
                const charIndex = crypto.randomInt(0, mixedString.length);
                if (result.length === 0 && mixedString[charIndex] === '0') {
                    continue;
                }
                result += mixedString[charIndex];
            }

            return result;
        }
        case RandomValueTypeEnum.UUID: {
            return uuid();
        }
        default: {
            return null;
        }
    }
};
