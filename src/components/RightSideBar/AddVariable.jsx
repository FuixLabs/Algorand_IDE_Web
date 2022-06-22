import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from './styles/AddVariable';
import { Typography, Button, TextField, Box, Chip } from '@mui/material';
import Header from './Header';
import InfoIcon from '@mui/icons-material/Info';
import Constants from '../../util/Constant';
import './styles/index.scss';
import { renderType } from '../../scripts/util';
import ConfirmModal from '../ConfirmModal';
const Info = ({ children, color }) => {
    return (
        <div className="info" data-test="test__not_has_type">
            <InfoIcon color="primary" />
            <Typography color={color || 'textSecondary'}>{children}</Typography>
        </div>
    );
};

Info.propTypes = {
    children: PropTypes.object,
    color: PropTypes.string,
};

const AddVariable = ({ node, onSave, onDelete, elements, classes, onNodeError }) => {
    const [_node, setNode] = useState(JSON.parse(JSON.stringify(node)));
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState('');
    const [variableUsedBefore, setVariableUsed] = useState([]);
    let sourceNode = elements.find((item) => item.id === node.source);
    let targetNode = elements.find((item) => item.id === node.target);
    let isHasType = Boolean(sourceNode?.data?.type?.[0]?.value);
    useEffect(() => {
        setLoading(false);
        if (isHasType) {
            /* fix bug: unsaved changes is cleared when walletConnect/UPDATE_ASSETS dispatched */
            if (node.id === _node.id) {
                let __node = JSON.parse(JSON.stringify(node));
                __node.data.variables = sourceNode.data.type.map((item, index) => {
                    return __node.data.variables?.[index] || _node.data.variables?.[index]
                        ? _node.data.variables?.[index]
                            ? _node.data.variables?.[index]
                            : __node.data.variables[index]
                        : { value: '' };
                });
                setNode(__node);
                return;
            }

            let __node = JSON.parse(JSON.stringify(node));
            __node.data.variables = sourceNode.data.type.map((item, index) => {
                return __node.data.variables && __node.data.variables[index]
                    ? __node.data.variables[index]
                    : { value: '' };
            });
            setNode(__node);
        }
    }, [node, elements, sourceNode, isHasType]);
    const checkVariable = (variableDefined = {}, variable = {}, updateCount, variableFlowNodId) => {
        let v = variableDefined.variables;
        let found = v.find((item) => item.value === variable.value && item.type !== variable.type);
        if (found) {
            return 'Value is already defined';
        }
        let keys = Object.keys(variableFlowNodId);
        for (let i = 0; i < keys.length; i++) {
            for (let y = 0; y < variableFlowNodId[keys[i]].length; y++) {
                if (variableFlowNodId[keys[i]][y] === variable.value) {
                    let count = updateCount();
                    if (count === 4) {
                        return 'You cannot have more than 3 pairs of namesake variable coming in a single operation';
                    }
                }
            }
        }

        return null;
    };
    const save = () => {
        let __node = JSON.parse(JSON.stringify(_node)),
            variableDefined = Constants.getVariables(elements, targetNode.id),
            isVerify = true;
        variableDefined.variables = variableDefined.variables.filter((item) => item.node !== node.id);
        let variableFlowNodId = {};
        variableDefined.variables.forEach((item) => {
            variableFlowNodId[item.node] = variableFlowNodId[item.node] ? variableFlowNodId[item.node] : [];
            variableFlowNodId[item.node].push(item.value);
        });
        let count = 0,
            keys = Object.keys(variableFlowNodId);
        //count bindings
        const updateCount = () => {
            count++;
            return count;
        };
        if (keys.length === 2) {
            variableFlowNodId[keys[0]].forEach((item) => {
                if (variableFlowNodId[keys[1]].includes(item)) {
                    count++;
                }
            });
        }
        __node.data.variables = __node.data.variables.map((item, index) => {
            if (!Constants.isVariableValue(item.value)) {
                isVerify = false;
                item.error = 'Value is invalid';
            } else {
                delete item.error;
            }
            let _elements = JSON.parse(JSON.stringify(elements));
            let found = _elements.find((item) => item.id === __node.id);
            found.data.variables = [];
            let error = checkVariable(
                variableDefined,
                { value: item.value, type: sourceNode.data.type[index].value },
                updateCount,
                variableFlowNodId
            );
            if (!item.error && error) {
                item.error = error;
                isVerify = false;
            }
            return item;
        });
        if (isVerify) {
            let _variablesUsed = _getVariablesUsed(__node.data.variables.map((item) => item.value));
            if (_variablesUsed.length) {
                toggleModal('save');
                return setVariableUsed(_variablesUsed);
            }
            return onSave(_node);
        }

        setNode(__node);
    };
    const _getVariablesUsed = (newVariables = []) => {
        let variablesUsed = Constants.getVariablesIsUse(elements, targetNode.id);
        let _variablesUsed = [];
        node.data.variables.forEach((item) => {
            let key = item?.value;
            let nodeIdsUseKeyVariable = variablesUsed.variables[key];
            if (nodeIdsUseKeyVariable && !newVariables.includes(key)) {
                _variablesUsed.push({ [key]: nodeIdsUseKeyVariable });
            }
        });
        return _variablesUsed;
    };
    const onOk = () => {
        if (open === 'save') {
            onSave(_node);
        } else {
            onDelete(node);
        }
        let ids = [];
        variableUsedBefore.forEach((element) => {
            let key = Object.keys(element)[0];
            element[key].forEach((item) => {
                ids.push(item);
            });
        });

        toggleModal();
        setTimeout(() => {
            onNodeError(ids);
        }, 100);
    };
    const toggleModal = (key = '') => {
        if (key === 'save' || key === 'delete') {
            return setOpen(key);
        }
        setOpen('');
    };
    const handleChange = (event, index) => {
        let __node = JSON.parse(JSON.stringify(_node));
        __node.data.variables[index] = { value: event.target.value };
        setNode(__node);
    };
    const deleteNode = () => {
        let _variablesUsed = _getVariablesUsed([]);
        if (_variablesUsed.length) {
            toggleModal('delete');
            return setVariableUsed(_variablesUsed);
        }
        onDelete(node);
    };
    const isDisabled = () => {
        let cnt = 0;
        for (let i = 0; i < _node.data.variables.length; i++) {
            if (!_node.data.variables[i] || !_node.data.variables[i].value) {
                return true;
            }
            if (
                node.data.variables[i] &&
                _node.data.variables[i] &&
                node.data.variables[i].value === _node.data.variables[i].value
            ) {
                cnt++;
            }
        }
        return cnt === _node.data.variables.length || false;
    };
    if (loading) return '';
    return (
        <div className="add-variable-container">
            <Header title="Edit Variable" />
            <div className="add-variable-body">
                {isHasType && (
                    <Info>
                        <>Please set variables mappings for each Type’s property of “{sourceNode.data.label}”</>
                    </Info>
                )}
                {isHasType ? (
                    _node.data.variables &&
                    sourceNode.data.type.map((item, index) => {
                        if (!_node.data.variables || !_node.data.variables[index]) return '';
                        let variable = _node.data.variables[index];
                        return (
                            <div key={index}>
                                <Typography color="primary" className={'type'}>
                                    {renderType(item.value, item.description)}
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={variable.value}
                                    label="Variable"
                                    className={'input ' + classes.input}
                                    onChange={(event) => handleChange(event, index)}
                                    helperText={variable.error}
                                    error={Boolean(variable.error)}
                                    data-test={'test__input_' + index}
                                ></TextField>
                            </div>
                        );
                    })
                ) : (
                    <Info>
                        <>
                            Please add a type for the <span className="name">“{sourceNode.data.label}”</span> block of
                            this connection!
                        </>
                    </Info>
                )}
            </div>
            <div className="add-variable-footer">
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={save}
                    disabled={isDisabled() || !isHasType}
                    data-test="test__button-save"
                >
                    Save Changes
                </Button>
                <Button color="error" variant="outlined" fullWidth onClick={deleteNode} data-test="test__button-delete">
                    Delete Variable
                </Button>
            </div>
            <ConfirmModal open={Boolean(open)} handleClose={toggleModal} title="Warning" icon="warning" onOk={onOk}>
                <Typography color="textSecondary">
                    {`Changing variables's name will cause errors at where they are being used. You need to update the
                    operations manually. The variables are listed as following:`}
                </Typography>
                <Box sx={{ padding: '12px 0px', flex: 1, overflow: ' auto' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {variableUsedBefore.map((_item) => {
                            let variable = Object.keys(_item)[0];
                            return (
                                <Chip
                                    sx={{ margin: '4px 8px', maxWidth: 'calc(100% - 16px)', fontWeight: 600 }}
                                    key={variable}
                                    label={variable}
                                ></Chip>
                            );
                        })}
                    </Box>
                </Box>
                <Typography color="textSecondary">Are you sure to proceed?</Typography>
            </ConfirmModal>
        </div>
    );
};

AddVariable.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    elements: PropTypes.array,
    classes: PropTypes.object,
    onNodeError: PropTypes.func,
};
export default withStyles(st)(AddVariable);
