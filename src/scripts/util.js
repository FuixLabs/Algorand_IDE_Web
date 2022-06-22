/* global BigInt */
import Constant from '../util/Constant';
export function formatBigNumWithDecimals(num, decimals) {
    const singleUnit = BigInt('1' + '0'.repeat(decimals));
    const wholeUnits = num / singleUnit;
    const fractionalUnits = num % singleUnit;
    return wholeUnits.toString() + '.' + fractionalUnits.toString().padStart(decimals, '');
}

export function compactAddress(address) {
    if (address.length < 12) return address;
    return address.slice(0, 6) + '...' + address.slice(-6);
}
export function renderType(type, des) {
    if (des) {
        return des + ' (' + type + ')';
    }
    return type;
}
const connectionKeysExpression = [
    { key: 'source', isRequired: true },
    { key: 'target', isRequired: true },
    { key: 'type', isRequired: true, value: 'straight' },
    {
        key: 'label',
        isRequired: true,
    },
    {
        key: 'data',
        isRequired: true,
        value: [{ key: 'expressions', value: [], isRequired: true }],
    },
];
const connectionKeysVariable = [
    { key: 'source', isRequired: true },
    { key: 'target', isRequired: true },
    { key: 'type', isRequired: true, value: 'straight' },
    {
        key: 'label',
        isRequired: true,
    },
    {
        key: 'data',
        isRequired: true,
        value: [{ key: 'variables', value: [], isRequired: true }],
    },
];
const placeKeys = [
    { key: 'type', isRequired: true },
    { key: 'position', isRequired: true },
    {
        key: 'data',
        value: [
            {
                key: 'type',
                isRequired: true,
            },
            {
                key: 'guard',
            },
            {
                key: 'markings',
            },
        ],
    },
];
const checkKeys = (keys, element) => {
    for (let i = 0; i < keys.length; i++) {
        let item = keys[i];
        if (item.value && Array.isArray(item.value) && item.value.length) {
            return checkKeys(item.value, element[item.key]);
        }
        if (item.isRequired && !element[item.key]) {
            return false;
        }
    }
    return true;
};
export function verifyElement(element, elements) {
    if (!Constant.isConnection(element) && !Constant.isRegister(element) && !Constant.isOperation(element)) {
        return false;
    }
    if (
        Constant.isConnection(element) &&
        ((Constant.isOperation(elements.find((item) => item.id === element.source)) &&
            !checkKeys(connectionKeysExpression, element)) ||
            (Constant.isOperation(elements.find((item) => item.id === element.target)) &&
                !checkKeys(connectionKeysVariable, element)))
    ) {
        return false;
    }
    if ((Constant.isOperation(element) || Constant.isRegister(element)) && !checkKeys(placeKeys, element)) {
        return false;
    }

    return true;
}
export function verifyElements(data) {
    if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (!verifyElement(item, data)) {
                return false;
            }
        }
        return true;
    }
    if (typeof data === 'object') {
        if (data.elements && Array.isArray(data.elements)) {
            return verifyElements(data.elements);
        }
    }
    return false;
}
