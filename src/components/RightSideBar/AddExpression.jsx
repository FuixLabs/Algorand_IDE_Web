import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from './styles/AddVariable';
import { Typography, Button, TextField } from '@mui/material';
import Header from './Header';
import InfoIcon from '@mui/icons-material/Info';
import nearley from 'nearley';
import expressionPostfix from '../../util/expressionPostfix.js';
import './styles/index.scss';
import { renderType } from '../../scripts/util';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpModal from './AddGuard/HelpModal';
import ConstantsG from '../../util/Constant';
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

const AddExpression = ({ node, onSave, onDelete, elements, classes }) => {
    const [_node, setNode] = useState(JSON.parse(JSON.stringify(node)));

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    let targetNode = elements.find((item) => item.id === node.target);
    let sourceNode = elements.find((item) => item.id === node.source);
    let isHasType = Boolean(targetNode?.data?.type?.[0]?.value);
    useEffect(() => {
        setLoading(false);
        if (isHasType) {
            /* fix bug: unsaved changes is cleared when walletConnect/UPDATE_ASSETS dispatched */
            if (node.id === _node.id) {
                let __node = JSON.parse(JSON.stringify(node));
                __node.data.expressions = targetNode.data.type.map((item, index) => {
                    return __node.data.expressions?.[index] || _node.data.expressions?.[index]
                        ? _node.data.expressions?.[index]
                            ? _node.data.expressions?.[index]
                            : __node.data.expressions?.[index]
                        : { value: '' };
                });
                setNode(__node);
                return;
            }

            let __node = JSON.parse(JSON.stringify(node));
            __node.data.expressions = targetNode.data.type.map((item, index) => {
                return __node.data.expressions && __node.data.expressions[index]
                    ? __node.data.expressions[index]
                    : { value: '' };
            });
            setNode(__node);
        }
    }, [node, elements, targetNode, isHasType]);
    const toggleModal = () => {
        setOpen(!open);
    };
    const checkExpression = (expression) => {
        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(expressionPostfix));
        try {
            parser.feed(expression);
            // console.log('parser', parser);
            if (!parser.results || !parser.results[0]) {
                return false;
            }
            return parser.results[0];
        } catch (err) {
            // console.log(err);
            return false;
        }
    };

    const save = () => {
        let __node = JSON.parse(JSON.stringify(_node)),
            isVerify = true;
        __node.data.expressions = __node.data.expressions.map((item, index) => {
            let expression = checkExpression(item.value);
            if (!expression) {
                item.error = 'Value is invalid';
                isVerify = false;
            } else {
                delete item.error;
            }
            if (!item.error) {
                let variables = ConstantsG.getVariablesFromCondition(item.value) || [];
                if (
                    variables.length &&
                    !ConstantsG.variableDefined(
                        elements,
                        variables.map((value) => ({
                            value,
                            type: targetNode.data.type[index].value,
                        })),
                        sourceNode.id,
                        variables[0] === item.value, // true when item.value is single variable, false when item.value look like isEmpty(x) => use func spacial
                        variables[0] === item.value // true when item.value is single variable, false when item.value look like isEmpty(x) => use func spacial
                    )
                ) {
                    item.error = variables.toString().replace(/,/g, ', ') + ' is not yet defined';
                    isVerify = false;
                }
            }

            item.value = item.value.trim();
            return item;
        });
        if (isVerify) {
            return onSave(__node);
        }
        setNode(__node);
    };
    const handleChange = (event, index) => {
        let __node = JSON.parse(JSON.stringify(_node));
        __node.data.expressions[index] = { value: event.target.value };
        setNode(__node);
    };
    const deleteNode = () => {
        onDelete(node);
    };
    const isDisabled = () => {
        let cnt = 0;
        for (let i = 0; i < _node.data.expressions.length; i++) {
            if (!_node.data?.expressions[i] || !_node.data?.expressions[i].value) {
                return true;
            }
            // console.log(i);
            if (
                node.data?.expressions[i] &&
                _node.data?.expressions[i] &&
                node.data?.expressions[i].value === _node.data?.expressions[i].value
            ) {
                cnt++;
            }
        }
        return cnt === _node.data.expressions.length || false;
    };
    if (loading) return '';
    return (
        <div className="add-variable-container">
            <Header title="Edit Expression">
                <Tooltip title="Learn how to use expressions">
                    <IconButton sx={{ marginLeft: 1 }} onClick={toggleModal}>
                        <Typography color="textPrimary" sx={{ display: 'flex' }}>
                            <HelpIcon />
                        </Typography>
                    </IconButton>
                </Tooltip>
            </Header>
            <div className="add-variable-body">
                {isHasType ? (
                    _node.data.expressions &&
                    targetNode.data.type.map((item, index) => {
                        if (!_node.data.expressions || !_node.data.expressions[index]) return '';
                        let expression = _node.data.expressions[index];
                        return (
                            <div key={index}>
                                <Typography color="primary" className={'type'}>
                                    {renderType(item.value, item.description)}
                                </Typography>
                                <TextField
                                    fullWidth
                                    value={expression.value}
                                    label={item.value}
                                    className={'input ' + classes.input}
                                    onChange={(event) => handleChange(event, index)}
                                    helperText={expression.error}
                                    error={Boolean(expression.error)}
                                    data-test={'test__input_' + index}
                                ></TextField>
                            </div>
                        );
                    })
                ) : (
                    <Info>
                        <>
                            Please add a type for the{' '}
                            <Typography component="span" sx={{ color: 'primary.main' }}>
                                “{targetNode.data.label}”
                            </Typography>{' '}
                            block of this connection!
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
                    Delete Expression
                </Button>
            </div>
            <HelpModal open={open} onClose={toggleModal} />
        </div>
    );
};

AddExpression.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    elements: PropTypes.array,
    classes: PropTypes.object,
};
export default withStyles(st)(AddExpression);
