import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/index.scss';
import { withStyles } from '@mui/styles';
import st from '../styles/AddGuard';
import { Typography, Button, TextField } from '@mui/material';
import Header from '../Header';
import nearley from 'nearley';
import guardPostfix from '../../../util/guardPostfix.js';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpModal from './HelpModal';
import InfoIcon from '@mui/icons-material/Info';
import Constants from '../../../util/Constant';
import { useSelector, shallowEqual } from 'react-redux';
const AddGuard = ({ node, onSave, onDelete, classes }) => {
    const [_node, setNode] = useState(JSON.parse(JSON.stringify(node)));
    const [guard, setGuard] = useState(node.data.guard || '');
    const [errorGuard, setErrorGuard] = useState('');
    const [errorName, setErrorName] = useState('');
    const [open, setOpen] = useState(false);
    const elements = useSelector((state) => {
        return state.model.elements;
    }, shallowEqual);
    useEffect(() => {
        setNode(JSON.parse(JSON.stringify(node)));
        setGuard(node.data.guard || '');
    }, [node, _node.id]);
    const toggleModal = () => {
        setOpen(!open);
    };
    const checkGuard = (_guard) => {
        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(guardPostfix));
        try {
            parser.feed(_guard);
            if (!parser.results || !parser.results[0]) {
                return false;
            }
            return true;
        } catch (err) {
            // console.log(err);
            return false;
        }
    };
    const checkVariableInCondition = (guard) => {
        let variables = Constants.getVariablesFromCondition(guard);
        let rs = [];
        variables.forEach((item) => {
            if (!Constants.variableDefined(elements, [{ value: item }], node.id)) {
                rs.push(item);
            }
        });
        return rs;
    };
    const save = () => {
        if (!guard || !_node.data.label) {
            setErrorGuard(!guard ? 'Input is required' : '');
            setErrorName(!_node.data.label ? 'Input is required' : '');
            return;
        }
        if (!_node.data.label.trim()) {
            return setErrorName('Value is invalid');
        }
        if (!checkGuard(guard)) {
            return setErrorGuard('Input is invalid');
        }
        let rs = checkVariableInCondition(guard);
        if (rs.length) {
            return setErrorGuard(`${rs.toString().replace(/,/g, ', ')} is not yet defined`);
        }

        _node.data.guard = guard;
        onSave(_node);
    };

    const deleteNode = () => {
        onDelete(_node);
    };

    const handleChange = (event) => {
        setErrorGuard('');
        setGuard(event.target.value);
    };

    const handleChangeName = (event) => {
        setErrorName('');
        let node = JSON.parse(JSON.stringify(_node));
        node.data.label = event.target.value;
        setNode(node);
    };

    const isDisabled = () => {
        return !guard || !_node.data.label || (guard === node.data.guard && _node.data.label === node.data.label);
    };

    return (
        <div className="add-guard">
            <Header title={'Edit Guard'}>
                <Tooltip title="Learn how to use expressions">
                    <IconButton sx={{ marginLeft: 1 }} onClick={toggleModal}>
                        <Typography component="span" color="textPrimary" sx={{ display: 'flex' }}>
                            <HelpIcon />
                        </Typography>
                    </IconButton>
                </Tooltip>
            </Header>
            <div className="add-guard-body">
                <Typography color="primary" className="title-form">
                    NAME OF OPERATION
                </Typography>
                <TextField
                    label="Name"
                    autoComplete="current-password"
                    value={_node.data.label}
                    onChange={handleChangeName}
                    className={classes.input + ' input-name'}
                    fullWidth
                    error={Boolean(errorName)}
                    helperText={errorName}
                    data-test="test__input_name"
                />
                <Typography color="primary" className="title-form" sx={{ display: 'flex' }}>
                    CONDITION
                    <Tooltip
                        title={
                            <>
                                <Typography color="inherit">
                                    You can use all operators and logics for condition{' '}
                                </Typography>
                                <Typography color="inherit">Ex: a&gt;b, a NOT b, a AND b, A = B….</Typography>
                                <Typography color="inherit">All conditions will be returned: TRUE or FALSE</Typography>
                            </>
                        }
                    >
                        <Typography component="span" color="textPrimary" sx={{ display: 'flex', marginLeft: 1 }}>
                            <InfoIcon />
                        </Typography>
                    </Tooltip>
                </Typography>
                <TextField
                    placeholder="Condition for Operation..."
                    multiline
                    rows={5}
                    fullWidth
                    onChange={handleChange}
                    value={guard}
                    className={classes.input + ' condition'}
                    error={Boolean(errorGuard)}
                    helperText={errorGuard}
                    data-test="test__input_condition"
                />
            </div>
            <div className="add-guard-footer">
                <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={save}
                    disabled={isDisabled()}
                    data-test="test__button-save"
                >
                    Save Changes
                </Button>
                <Button color="error" variant="outlined" fullWidth onClick={deleteNode} data-test="test__button-delete">
                    Delete Operation
                </Button>
            </div>
            <HelpModal open={open} onClose={toggleModal} />
        </div>
    );
};

AddGuard.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    classes: PropTypes.object,
};
export default withStyles(st)(AddGuard);
