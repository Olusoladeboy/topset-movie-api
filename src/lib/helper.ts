import bcryptjs from 'bcryptjs';
import { QueryEntityType } from './types';

export function hash(str = ''): string {
    return bcryptjs.hashSync(str, 5);
}

// export const errorHandler = (message = 'An Error Occurred', code = 400) => {
//     const error = new Error(message);
//     error.code = code;
//     return error;
// }

export const getEntityCount = (entity: QueryEntityType): number => {
    if (!entity.payload) return 0;
    if (Array.isArray(entity.payload)) return entity.payload.length;
    return 1;
};

export const decimal2JSON = (v: any, i?: any, prev?: any) => {
    if (v !== null && typeof v === 'object') {
        if (v.constructor.name === 'Decimal128') { prev[i] = v.toString(); } else { Object.entries(v).forEach(([key, value]) => decimal2JSON(value, key, prev ? prev[i] : v)); }
    }
};

export const setLimit = (inputlimit: any = 100) => {
    const limit = parseInt(inputlimit, 10);
    return (isNaN(limit) || limit == null || limit > 100 || limit === 0) ? 100 : limit;
}

export const hasProp = (obj: any, prop: any) => {
    if (!isRealValue(obj)) return false;
    return (obj[prop] !== undefined);
    // return Object.prototype.hasOwnProperty.call(obj, prop);
}

export const isRealValue = (object: any) => {
    return typeof object !== 'undefined' || object !== null;
}

export function generateVerificationCode() {
    const token = generateOtp();
    // set expire=y date
    const expiresIn = Date.now() + 25 * 60 * 1000;
    return { token, expiresIn };
}


/**
   * @returns a four-digit random number
   */
export function generateOtp() {
    const num = Math.floor(Math.random() * 9000) + 1000;
    return num;
}

export function hasCodeExpired(time: Date) {
    return new Date().toUTCString() > new Date(time).toUTCString();
}

function daysIntoYear(date = new Date()) {
    // eslint-disable-next-line max-len
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

export function genCode(len = 9) {
    let d = new Date().getFullYear().toString().substr(-2);
    d += daysIntoYear();
    if (len - d.length > 0) {
        return d + genString(len - d.length);
    }
    return genString(len);
}

export function genString(length: number, possible = '') {
    let text = '';
    const str = possible || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
        text += str.charAt(Math.floor(Math.random() * str.length));
    }
    return text;
}

export function generateCode(terminalId: any, len = 10) {
    let d = new Date().getFullYear().toString().substr(-1);
    d += daysIntoYear();
    if (terminalId && terminalId.length > 2) d += terminalId.substr(-2);
    if (len - d.length > 0) {
        return d + genString(len - d.length, '0987654321');
    }
    return genString(len, '0987654321');
}

export async function generateModelCode(Model: any, sample: any) {
    let code = generateCode(sample, 20);
    let duplicate = await Model.findOne({ code }).exec();
    if (duplicate) {
        code = generateCode(sample, 20);
        duplicate = await Model.findOne({ code }).exec();
        if (duplicate) {
            code = generateCode(sample, 20);
            duplicate = await Model.findOne({ code }).exec();
        }
    }
    return code;
}

export function cleanDeepObject(obj: any) {
    // eslint-disable-next-line no-restricted-syntax
    for (const propName in obj) {
        if (!obj[propName] || obj[propName].length === 0) {
            delete obj[propName];
        } else if (typeof obj === 'object') {
            cleanDeepObject(obj[propName]);
        }
    }
    return obj;
}

let depth = 0;

// eslint-disable-next-line complexity
export function cleanObject(obj: any) {
    depth += 1;
    // eslint-disable-next-line no-restricted-syntax
    for (const propName in obj) {
        if (!obj[propName] || obj[propName].length === 0) {
            delete obj[propName];
        } else if (typeof obj === 'object') {
            if (depth <= 3) cleanObject(obj[propName]);
        }
    }
    return obj;
}

/**
   * @description a function that removes duplicates from an array of objects
   * @param {Array} arrayOfObj an array of objects with duplicate value for
   *  a given property
   * @param {String} prop the property with duplicate values that renneds to be filtered by
   */
export function removeDuplicates(arrayOfObj: any, prop: any) {
    const setOfSeenObj = new Set();
    const filteredArr = arrayOfObj.filter((item: any) => {
        const duplicate = setOfSeenObj.has(item[prop]);
        setOfSeenObj.add(item[prop]);
        return !duplicate;
    });
    return filteredArr;
}

export const parseId = (result: any) => JSON.parse(JSON.stringify(result).replace(/_id/g, 'id'));

export function safeGet(obj: any, prop: any, empty = '') {
    if (obj == null) return empty;
    return ({ ...obj })[prop] || empty;
}

export function toObjectId(baseId = '5951bc91860d8b5ba', mysqlId = 1) {
    const oldId = mysqlId.toString(10);
    const a = (oldId.length < 7) ? '0'.repeat(7 - oldId.length) : '0';
    return baseId + a + oldId;
}