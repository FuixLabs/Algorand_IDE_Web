import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import '../styles/index.scss';
import { withStyles } from '@mui/styles';
import st from '../styles/RegisterForm';
import {
    Typography,
    MenuItem,
    FormControl,
    Select,
    Button,
    TextField,
    IconButton,
    InputLabel,
    Switch,
    Box,
    Chip,
    Tooltip,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import UploadIcon from '../UploadIcon';
import { Context } from '../../../useContext';
import Constants from '../../../util/Constant';
import ConfirmModal from '../../ConfirmModal';
const DescriptionTab = ({ node, onSave, classes, onDelete, elements, onNodeError }) => {
    const [_node, setNode] = useState(JSON.parse(JSON.stringify(node)));
    const [tmpNode, setTmpNode] = useState(JSON.parse(JSON.stringify(node)));
    const [error, setError] = useState('');
    const [open, setOpen] = useState('');
    const [variableUsedBefore, setVariableUsed] = useState([]);
    const { IPFS } = useContext(Context);
    useEffect(() => {
        // if (node.id === _node.id && node.data.tokenIcon !== _node.data.tokenIcon) {
        //     let tmpNode = JSON.parse(JSON.stringify(_node));
        //     tmpNode.data.tokenIcon = node.data.tokenIcon;
        //     setNode(tmpNode);
        // }
        let tmpNode = JSON.parse(JSON.stringify(node));
        setNode(tmpNode);
    }, [node, _node.id]);
    const _getVariablesUsed = (newVariables = [], transitionID) => {
        let variablesUsed = Constants.getVariablesIsUse(elements, transitionID);
        let _variablesUsed = [];
        newVariables.forEach((item) => {
            let key = item?.value;
            let nodeIdsUseKeyVariable = variablesUsed[0]?.variables[key];
            if (nodeIdsUseKeyVariable) {
                _variablesUsed.push({ [key]: nodeIdsUseKeyVariable });
            }
        });
        return _variablesUsed;
    };
    const save = () => {
        let __node = JSON.parse(JSON.stringify(_node));
        if (!__node.data.label.trim()) {
            return setError('Value is invalid');
        }
        __node.data.type = __node.data.type.filter((item) => item && item.value);
        if (!__node.data.type.length) {
            __node.data.type.push({});
        }
        if (isDifferentType()) {
            __node.data.markings = [];
        }
        let foundConnection = elements.find((item) => Constants.isConnection(item) && item.source === __node.id),
            _connection = {};
        if (foundConnection?.data.variables?.length > __node.data.type.length) {
            _connection = JSON.parse(JSON.stringify(foundConnection));
            let variableDelete = foundConnection.data.variables.slice(
                __node.data.type.length,
                foundConnection.data.variables?.length
            );
            _connection.data.variables = _connection.data.variables.slice(0, __node.data.type.length);
            let _variablesUsed = _getVariablesUsed(variableDelete, foundConnection.id);
            if (_variablesUsed.length) {
                toggleModal('save');
                setTmpNode(__node);
                return setVariableUsed(_variablesUsed);
            }
        }
        onSave([__node, _connection]);
    };
    const toggleModal = (key = '') => {
        if (key === 'save' || key === 'delete') {
            return setOpen(key);
        }
        setOpen('');
    };
    const onOk = () => {
        if (open === 'save') {
            let foundConnection = elements.find((item) => Constants.isConnection(item) && item.source === _node.id);
            foundConnection.data.variables = foundConnection.data.variables.slice(0, tmpNode.data.type.length);
            onSave([tmpNode, foundConnection]);
        } else {
            onDelete(_node);
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
        }, 500);
    };

    const deleteNode = () => {
        let foundConnection = elements.find((item) => Constants.isConnection(item) && item.source === _node.id);
        if (foundConnection) {
            let variableDelete = foundConnection?.data?.variables;
            let _variablesUsed = _getVariablesUsed(variableDelete);
            if (_variablesUsed.length) {
                toggleModal('delete');
                return setVariableUsed(_variablesUsed);
            }
        }
        onDelete(_node);
    };

    const handleChange = (event, index) => {
        let node = JSON.parse(JSON.stringify(_node));
        if (!node.data.type[index]) {
            node.data.type[index] = {};
        }

        node.data.type[index].value = event.target.value;
        setNode(node);
    };

    const handleChangeName = (event) => {
        let node = JSON.parse(JSON.stringify(_node));
        node.data.label = event.target.value;
        setError();
        setNode(node);
    };

    const handleChangeAllow = (event) => {
        let node = JSON.parse(JSON.stringify(_node));
        node.data.allowAddData = event.target.checked;
        setNode(node);
    };

    const addOption = () => {
        let node = JSON.parse(JSON.stringify(_node));
        node.data.type.push({ value: '' });
        setNode(node);
    };

    const deleteOption = (index) => {
        let node = JSON.parse(JSON.stringify(_node));
        node.data.type[index] = null;
        setNode(node);
    };

    const isShowButtonDelete = () => {
        let cnt = 0;
        _node.data.type.forEach((item) => {
            if (item) cnt++;
        });
        return cnt > 1;
    };

    const isDifferentType = () => {
        let type = _node.data.type.filter((item) => item && item.value) || [{}];
        let _isDifferentType = false;
        if (type.length === node.data.type.length) {
            type.forEach((item, index) => {
                //check old data vs new data
                if (item.value !== node.data.type[index].value) {
                    _isDifferentType = true;
                }
                if (item.description !== node.data.type[index].description) {
                    _isDifferentType = true;
                }
            });
        } else {
            _isDifferentType = true;
        }
        return _isDifferentType;
    };
    const isDisabled = () => {
        let cnt = 0;
        _node.data.type.forEach((item) => {
            if (item && item.value) cnt++; //at least 1 is defined
        });
        let isDifferentAlow = false;
        if (node.data.allowAddData !== _node.data.allowAddData) {
            isDifferentAlow = true;
        }
        if (
            _node.data.label &&
            (node.data.tokenIcon !== _node.data.tokenIcon || _node.data.label !== node.data.label)
        ) {
            return false;
        }
        return (
            !_node.data.label ||
            cnt === 0 ||
            (!isDifferentType() && !isDifferentAlow && _node.data.label === node.data.label)
        );
    };
    const handleChangeDes = (event, index) => {
        let node = JSON.parse(JSON.stringify(_node));
        if (!node.data.type[index]) {
            node.data.type[index] = {};
        }
        node.data.type[index].description = event.target.value;
        setNode(node);
    };
    const handleUploadFile = (file, callback) => {
        if (IPFS) {
            const results = IPFS.add(file);
            results.then((res) => {
                let _node = JSON.parse(JSON.stringify(node));
                _node.data.tokenIcon = Constants.ipfsHost + res.path;
                setNode(_node);
                callback();
            });
        }
    };
    const onRemove = () => {
        let _node = JSON.parse(JSON.stringify(node));
        _node.data.tokenIcon = Constants.tokenIcon;
        setNode(_node);
    };
    let cnt = 1;
    return (
        <>
            <div className="register-body">
                <UploadIcon onSave={onSave} handleUploadFile={handleUploadFile} node={_node} onRemove={onRemove} />
                <Typography color="primary" className="title-form">
                    NAME OF REGISTER
                </Typography>
                <TextField
                    label="Name"
                    autoComplete="current-password"
                    value={_node.data.label}
                    onChange={handleChangeName}
                    className={classes.borderInput + ' input-name'}
                    fullWidth
                    error={Boolean(error)}
                    helperText={error}
                    data-test="test__input-name"
                />
                <div className="switch">
                    <Switch onChange={handleChangeAllow} checked={_node.data.allowAddData || false} />{' '}
                    <Typography color="textSecondary">Allow to add data in DApps</Typography>
                </div>

                <Typography color="primary" className="title-form" sx={{ display: 'flex' }}>
                    LIST OF TYPE
                    <Tooltip
                        title={
                            <>
                                <Typography color="inherit">A message cannot include more than 4 attributes</Typography>
                                <Typography color="inherit">
                                    [String] values are limited to 64 characters at max
                                </Typography>
                                <Typography color="inherit">
                                    You cannot have more than 3 pairs of namesake variable coming in a single operation
                                </Typography>
                            </>
                        }
                    >
                        <Typography component="span" color="textPrimary" sx={{ display: 'flex', marginLeft: 1 }}>
                            <InfoIcon />
                        </Typography>
                    </Tooltip>
                </Typography>
                {_node.data.type.map((item, index) => {
                    if (!item) return '';
                    let label = `Type ${cnt++}`;
                    let indexOfTypeStringUsed = _node.data.type?.findIndex((item) => item?.value === 'STRING');
                    return (
                        <div className="type-container" key={index} data-test="test__select-type">
                            <FormControl fullWidth className="form-control">
                                <InputLabel>{label}</InputLabel>
                                <Select
                                    value={item.value || ''}
                                    onChange={(event) => handleChange(event, index)}
                                    className={classes.borderInput}
                                    MenuProps={{ classes: { paper: classes.select } }}
                                    label={label}
                                >
                                    {item.value ? (
                                        ''
                                    ) : (
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                    )}
                                    <MenuItem value={'INT'}>INT</MenuItem>
                                    {indexOfTypeStringUsed >= 0 && indexOfTypeStringUsed !== index ? (
                                        ''
                                    ) : (
                                        <MenuItem value={'STRING'}>STRING</MenuItem>
                                    )}

                                    <MenuItem value={'BOOLEAN'}>BOOLEAN</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                {/* <InputLabel id="label">Description</InputLabel> */}
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    onChange={(e) => handleChangeDes(e, index)}
                                    value={item.description || ''}
                                    className="input-description"
                                ></TextField>
                            </FormControl>
                            {isShowButtonDelete() ? (
                                <IconButton onClick={() => deleteOption(index)}>
                                    <RemoveCircleIcon classes={{ root: classes.svg }} />
                                </IconButton>
                            ) : (
                                ''
                            )}
                        </div>
                    );
                })}
                {_node.data?.type?.filter((item) => item)?.length === 4 ? (
                    ''
                ) : (
                    <Button variant="text" onClick={addOption} data-test="test__button-add-option">
                        <span className={classes.buttonAdd}>
                            <AddCircleIcon />
                            Add option
                        </span>
                    </Button>
                )}
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
            <div className="register-footer">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={save}
                    disabled={isDisabled()}
                    fullWidth
                    data-test="test__button-save"
                >
                    Save Changes
                </Button>
                <Button variant="outlined" color="error" onClick={deleteNode} fullWidth data-test="test__button-delete">
                    Delete Register
                </Button>
            </div>
        </>
    );
};

DescriptionTab.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    classes: PropTypes.object,
    elements: PropTypes.array,
    onNodeError: PropTypes.func,
};

export default withStyles(st)(DescriptionTab);
