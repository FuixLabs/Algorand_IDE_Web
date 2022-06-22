import register from '../images/register.svg';
import operation from '../images/operation.svg';
const ipfsHostSub = 'https://cloudflare-ipfs.com/ipfs/';
const ipfsHost = 'https://ipfs.infura.io/ipfs/';
const VARIABLES_VALUE = new RegExp('^[a-zA-Z_][a-zA-Z_0-9]*$');
const humanWord = {
    '&&': 'and',
    '||': 'or',
    '==': '=',
    '^': 'xor',
    '!=': '<>',
};

const OPERATORS = ['+', '-', '*', '/', '%', '^', '!=', '(', ')', '==', '&&', '||', '!', '>', '>=', '<=', '<'];

const constantsValue = ['True', 'False', 'xor', 'or', 'and'];

const FUNCS = ['isEmpty', 'substr', 'append'];
const funcParamsNumber = {
    isEmpty: 1,
    substr: 3,
    append: 2,
};
const isConnection = (node = { data: {} }) => node.data.typeBlock === Constants.connection.type;
const isRegister = (node = { data: {} }) => node.data.typeBlock === Constants.register.type;
const isOperation = (node = { data: {} }) => node.data.typeBlock === Constants.operation.type;
const isVariableValue = (variable) => {
    let humanWordKeys = Object.keys(humanWord);
    return (
        VARIABLES_VALUE.test(variable) &&
        !FUNCS.includes(variable) &&
        !humanWordKeys.includes(variable) &&
        !constantsValue.includes(variable)
    );
};
const getVariables = (elements, transitionID) => {
    let _variableDefined = { variables: [], connectionIds: [] };
    elements.forEach((item) => {
        if (Constants.isConnection(item) && item.target === transitionID) {
            if (item && item.data.label === 'Variable') {
                let sourceNode = elements.find((_item) => _item.id === item.source);
                _variableDefined.variables = _variableDefined.variables.concat(
                    item.data.variables?.map((_item, index) => ({
                        value: _item.value,
                        type: sourceNode?.data?.type[index]?.value,
                        node: item.id,
                    }))
                );
                _variableDefined.connectionIds[item.id] = item.data.variables.map((item) => item.value);
            }
        }
    });
    return _variableDefined;
};

const getVariablesFromCondition = (guard = '') =>
    guard
        .trim()
        .replace(/[`!%^&*()|+\-=<>\/]/g, ' ')
        .split(/\s+/)
        .filter((item) => isVariableValue(item));

//type = 1 undirected graph
//type === 0  directed graph
const getVariablesIsUse = (elements = [], transitionID = '') => {
    let _variableUsed = { variables: [] };
    elements.forEach((item) => {
        if (Constants.isConnection(item) && item.source === transitionID) {
            let variables = item?.data?.expressions?.map((_item) => getVariablesFromCondition(_item.value));
            if (variables.length) {
                variables = variables?.reduce((p, n) => p.concat(n));
            }
            variables?.forEach((_item) => {
                if (!_item) return;
                if (!_variableUsed.variables[_item]) {
                    _variableUsed.variables[_item] = [];
                }
                if (!_variableUsed.variables[_item].includes(item.id)) {
                    _variableUsed.variables[_item].push(item.id);
                }
            });
        }
        if (isOperation(item) && item.id === transitionID) {
            let variables = getVariablesFromCondition(item.data.guard);
            variables.forEach((_item) => {
                if (!_item) return;
                if (!_variableUsed.variables[_item]) {
                    _variableUsed.variables[_item] = [];
                }
                if (!_variableUsed.variables[_item].includes(item.id)) {
                    _variableUsed.variables[_item].push(item.id);
                }
            });
        }
    });
    return _variableUsed;
};

const variableDefined = (elements = [], variables = [], startNodeId = '', checkType = false, equalType = false) => {
    let _variableDefined = getVariables(elements, startNodeId);
    let defined = true;

    let v = _variableDefined.variables;
    variables.forEach((variable) => {
        let found = v.find((item) =>
            !checkType
                ? item.value === variable.value
                : item.value === variable.value &&
                  (!equalType ? item.type !== variable.type : item.type === variable.type)
        );
        if (!found) {
            defined = false;
        }
    });
    return defined;
};
const checkVariableInCondition = (elements, guard, node) => {
    let variables = getVariablesFromCondition(guard);
    let rs = [];
    variables.forEach((item) => {
        if (!variableDefined(elements, [{ value: item }], node.id)) {
            rs.push(item);
        }
    });
    return rs;
};
const verifyModel = (elements, log) => {
    let error = [];
    let haveLastOne = { variableConnect: false, expressionConnect: false };
    elements.forEach((item) => {
        if (isOperation(item)) {
            // haveLastOne.transition = true;
            let guard = item?.data?.guard;
            if (guard) {
                let rs = checkVariableInCondition(elements, guard, item);
                if (rs.length) {
                    if (log) {
                        console.log('Variable in guard not yet defined', item.id, rs);
                    }
                    error.push({
                        errorCode: 1,
                        id: item.id,
                    });
                }
            }
            // else {
            //     // console.log('Guard is not yet defined', item.id);
            // }
        }
        if (isConnection(item)) {
            let sourceNode = elements.find((_item) => _item.id === item.source);
            if (isOperation(sourceNode)) {
                haveLastOne.expressionConnect = true;

                if (item?.data?.expressions?.length) {
                    let targetNode = elements.find((_item) => _item.id === item.target);
                    if (item.data.expressions.length < targetNode?.data?.type?.length) {
                        error.push({
                            errorCode: 3,
                            id: item.id,
                        });
                        if (log) {
                            console.log('Expression is not yet defined', item.id);
                        }
                        return;
                    }
                    let variables = item?.data?.expressions?.map((_item) => getVariablesFromCondition(_item.value));
                    if (variables.length) {
                        variables = variables
                            ?.reduce((p, n) => p.concat(n))
                            ?.map((item) => ({
                                value: item,
                            }));
                    }
                    if (!variableDefined(elements, variables, sourceNode.id)) {
                        if (log) {
                            console.log('Variable in expression not yet defined.', item.id);
                        }
                        error.push({
                            errorCode: 2,
                            id: item.id,
                        });
                    }
                } else {
                    error.push({
                        errorCode: 3,
                        id: item.id,
                    });
                    if (log) {
                        console.log('Expression is not yet defined', item.id);
                    }
                }
            } else {
                haveLastOne.variableConnect = true;
                let variables = item?.data?.variables;
                if (!variables || !variables.length) {
                    error.push({
                        errorCode: 4,
                        id: item.id,
                    });
                    if (log) {
                        console.log('Variables is not yet defined', item.id);
                    }
                    return;
                }
                //check length of type and length's variables
                let sourceNode = elements.find((_item) => _item.id === item.source);
                if (sourceNode.data.type?.length > variables?.length) {
                    error.push({
                        errorCode: 4,
                        id: item.id,
                    });
                    if (log) {
                        console.log('Variables is not yet defined', item.id);
                    }
                }
            }
        }
        if (isRegister(item)) {
            let type = item?.data?.type;
            if (!type || !type.length || !type[0].value) {
                error.push({
                    errorCode: 5,
                    id: item.id,
                });
                if (log) {
                    console.log('Type is not yet defined', item.id);
                }
            }
        }
    });
    for (let key in haveLastOne) {
        if (!haveLastOne[key]) {
            error.push({
                errorCode: 6,
            });
            if (log) {
                console.log('Need last one ', key);
            }
        }
    }
    return error;
};
const Constants = {
    connection: {
        type: 'connection',
        label: 'Edge',
    },
    operation: {
        type: 'operation',
        label: 'Operation',
        icon: operation,
    },
    register: {
        type: 'register',
        label: 'Register',
        icon: register,
    },
    nodeType: 'nodeType',
    testAddress: 'YKDZ6IUA4IKJOHOT4XVMJSKKDCKYUNQIMZE33MKUU3L73JMJFDQCWVBUOU',
    tokenIcon: ipfsHostSub + 'QmaomyMYnkia3rebPjrA5RPVkeS8EF6t7v1PixhN6WRMUa',
    ipfsHost: ipfsHostSub,
    version: 1.0,
    toHumanWord: humanWord,
    operators: OPERATORS,
    functions: FUNCS,
    constantsValue,
    funcParamsNumber,
    isConnection,
    isRegister,
    isOperation,
    isVariableValue,
    variableDefined,
    getVariables,
    getVariablesFromCondition,
    getVariablesIsUse,
    verifyModel,
    // variableUsed,
};
export default Constants;
