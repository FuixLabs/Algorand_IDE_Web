import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from '../styles/RegisterForm';
import { Typography, Button, TextField, Switch, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import '../styles/AddMarkings.scss';
import { renderType } from '../../../scripts/util';
function dec2hex(dec) {
    return dec.toString(16).padStart(2, '0');
}
const getId = () => {
    var arr = new Uint8Array(40 / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
};

const getUpdateTime = () => {
    let now = new Date();
    return now.toLocaleString();
};

const AddMarkingsForm = ({ node, onSave, classes, data, setShow, setSelectRow, hide, onDelete, notAllowContinue }) => {
    const [marking, setMarking] = useState({ total: 1, tokens: [], lastUpdated: '' });
    const [continueAdd, setContinue] = useState(false);
    const [error, setError] = useState([]);
    const [errorTotal, setErrorTotal] = useState(false);
    const ref = useRef();
    useEffect(() => {
        if (data) {
            setMarking(JSON.parse(JSON.stringify(data)));
        }
    }, [data]);

    useEffect(() => {
        if (hide) {
            setMarking({ total: 1, tokens: [] });
            setError([]);
            setErrorTotal(false);
        }
    }, [hide]);

    const handleTotalChange = (event) => {
        let _marking = JSON.parse(JSON.stringify(marking));
        _marking.total = event.target.value;
        setErrorTotal('');
        setMarking(_marking);
    };
    const handleChangeAllow = (event) => {
        setContinue(event.target.checked);
    };
    const handleInputChange = (event, index) => {
        let _marking = JSON.parse(JSON.stringify(marking));
        _marking.tokens[index] =
            node.data.type[index].value === 'STRING' ? event.target.value?.substring(0, 64) : event.target.value;
        error[index] = '';
        setMarking(_marking);
    };
    const save = () => {
        let _node = JSON.parse(JSON.stringify(node));
        if (!_node.data.markings || !Array.isArray(_node.data.markings)) {
            _node.data.markings = [];
        }
        let hasError = false,
            _error = [];

        const addToken = [];
        const token = marking.tokens;
        node.data.type.forEach((item, index) => {
            //common case: empty or not choose
            if (!token?.[index] || !String(token[index]).trim()) {
                _error[index] = 'This field is required.';
                hasError = true;
                addToken[index] = null;
                return;
            }
            // console.log('item', item.value, token[index]);
            //specific type case
            switch (item.value) {
                case 'INT':
                    if (
                        // only numbers allowed. avoid case [numb]e[numb]
                        !/^[0-9]*$/.test(token[index]) ||
                        Number(token[index]) < 0 ||
                        Number(token[index]) > Math.pow(2, 32) - 1
                    ) {
                        _error[index] = 'Value is invalid. The number must be in range from 0 to 2^32 - 1';
                        hasError = true;
                    } else {
                        addToken[index] = parseInt(token[index]);
                    }
                    break;
                case 'BOOLEAN':
                    addToken[index] = token[index] === 'true' ? true : false;
                    break;
                case 'STRING':
                    //only letters, numbers and underscores allowed.
                    if (!/^[A-Za-z0-9 _]*$/.test(token[index])) {
                        hasError = true;
                        _error[index] = 'Value is invalid. Only letters, numbers, underscores and spaces allowed.';
                    }
                    addToken[index] = token[index];
                    break;
            }
        });

        if (marking.total && (!Number.isInteger(Number(marking.total)) || Number(marking.total) < 0)) {
            return setErrorTotal('Value is invalid!');
        }
        if (hasError) {
            return setError(_error);
        }
        if (marking.id) {
            _node.data.markings = _node.data.markings.map((item) => (item.id === marking.id ? marking : item));
        } else {
            marking.id = getId();
            marking.lastUpdated = getUpdateTime();
            _node.data.markings.push({ ...marking, tokens: addToken });
        }
        onSave(_node);
        setMarking({ total: 1, tokens: [] });
        setSelectRow();
        if (!continueAdd) {
            setShow();
        }
    };
    const isDisabled = () => {
        let _isDisabled = false;
        node.data.type.forEach((item, index) => {
            if (!marking.tokens[index]) {
                _isDisabled = true;
            }
        });
        return _isDisabled || !marking.total;
    };
    if (hide) return '';
    return (
        <div className="add-markings-form" data-test="test__container-form">
            <Grid container spacing={4} className="grid-container">
                <Grid item lg={5} md={5} sm={5} xs={12} className="left-gird">
                    <Typography color="primary" className="title-form">
                        NUMBER OF MESSAGE
                    </Typography>
                    <TextField
                        value={marking.total}
                        className={classes.borderInput + ' total'}
                        label="No."
                        // onChange={handleTotalChange}
                        fullWidth
                        error={Boolean(errorTotal)}
                        helperText={errorTotal}
                        type="number"
                        min="1"
                        data-test="test__input-total"
                        disabled={true}
                    />
                </Grid>
                <Grid item lg={7} md={7} sm={7} xs={12}>
                    <Typography color="primary" className="title-form">
                        MESSAGE
                    </Typography>
                    <div className="list-input">
                        {node.data.type.map((item, index) => {
                            if (!item || !item.value) return '';
                            marking.tokens[index] = marking.tokens[index] ?? '';
                            return item.value !== 'BOOLEAN' ? (
                                <TextField
                                    key={index}
                                    value={marking.tokens[index]}
                                    className={classes.borderInput}
                                    label={renderType(item.value, item.description)}
                                    onChange={(event) => handleInputChange(event, index)}
                                    fullWidth
                                    error={Boolean(error[index])}
                                    helperText={error[index]}
                                    data-test="test__input-type"
                                />
                            ) : (
                                <FormControl fullWidth key={index}>
                                    <InputLabel>{item.value}</InputLabel>
                                    <Select
                                        id="demo-simple-select"
                                        value={marking.tokens[index]}
                                        onChange={(event) => handleInputChange(event, index)}
                                        className={classes.borderInput}
                                        MenuProps={{ classes: { paper: classes.select } }}
                                        label={item.value}
                                        fullWidth
                                        data-test="test__select-type"
                                    >
                                        {marking.tokens[index] ? (
                                            ''
                                        ) : (
                                            <MenuItem>
                                                <em>None</em>
                                            </MenuItem>
                                        )}
                                        <MenuItem value={'true'}>TRUE</MenuItem>
                                        <MenuItem value={'false'}>FALSE</MenuItem>
                                    </Select>
                                </FormControl>
                            );
                        })}
                    </div>
                </Grid>
            </Grid>
            <div className="switch">
                {!marking.id ? (
                    notAllowContinue ? null : (
                        <>
                            <Switch onChange={handleChangeAllow} checked={continueAdd} data-test="test__checkbox" />{' '}
                            <Typography color="textSecondary">Continue to add after save</Typography>
                        </>
                    )
                ) : (
                    <Button
                        onClick={() => {
                            onDelete(marking);
                            setMarking({ total: '', tokens: [] });
                            setSelectRow();
                            setShow();
                        }}
                        variant="outlined"
                        color="error"
                        className="button-delete"
                        data-test="test__button-delete"
                    >
                        <span className="material-icons">delete</span>Delete
                    </Button>
                )}
                <Button
                    onClick={save}
                    variant="contained"
                    color="primary"
                    disabled={isDisabled()}
                    className="button-save"
                    data-test="test__button-save"
                >
                    Save
                </Button>
            </div>
        </div>
    );
};

AddMarkingsForm.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    elements: PropTypes.array,
    classes: PropTypes.object,
    data: PropTypes.any,
    setShow: PropTypes.func,
    setSelectRow: PropTypes.func,
    hide: PropTypes.bool,
    notAllowContinue: PropTypes.bool,
};
AddMarkingsForm.defaultProps = {
    notAllowContinue: false,
};
export default withStyles(st)(AddMarkingsForm);
