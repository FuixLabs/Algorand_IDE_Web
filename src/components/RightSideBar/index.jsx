import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import RegisterForm from './Register';
import AddGuard from './AddGuard/index';
import AddVariable from './AddVariable';
import AddExpression from './AddExpression';
import Constants from '../../util/Constant';
import { Typography } from '@mui/material';
import './styles/index.scss';

const isConnection = Constants.isConnection;

const ConnectionForm = ({ elements, node, onSave, onDelete, onNodeError }) => {
    let sourceNode = elements.find((item) => item.id === node.source);
    return Constants.isOperation(sourceNode) ? (
        <AddExpression node={node} onSave={onSave} onDelete={onDelete} elements={elements} />
    ) : (
        <AddVariable node={node} onSave={onSave} onDelete={onDelete} elements={elements} onNodeError={onNodeError} />
    );
};

ConnectionForm.propTypes = {
    elements: PropTypes.array,
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onNodeError: PropTypes.func,
};

const BlockForm = ({ node, onSave, onDelete, elements, onNodeError }) => {
    return Constants.isOperation(node) ? (
        <AddGuard node={node} onSave={onSave} onDelete={onDelete} />
    ) : (
        <RegisterForm node={node} onSave={onSave} onDelete={onDelete} elements={elements} onNodeError={onNodeError} />
    );
};

BlockForm.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    elements: PropTypes.array,
    onNodeError: PropTypes.func,
};

const RightSideBar = ({ classes, onNodeError, selections, onSave, onDelete, elements }) => {
    let node = selections ? selections[0] : null;
    return (
        <div className={'right-side-bar ' + classes.container}>
            <div className="body">
                {node ? (
                    isConnection(node) ? (
                        <ConnectionForm
                            node={node}
                            onSave={onSave}
                            onDelete={onDelete}
                            elements={elements}
                            onNodeError={onNodeError}
                        />
                    ) : (
                        <BlockForm
                            onNodeError={onNodeError}
                            node={node}
                            onSave={onSave}
                            onDelete={onDelete}
                            elements={elements}
                        />
                    )
                ) : (
                    <div className="no-selected" data-test="test__not-selected">
                        <Typography color="textPrimary" className="title">
                            No Element Selected
                        </Typography>
                        <Typography color="textSecondary" className="description">
                            Please click on: Register, Operation, Variable and Expression to edit or delete
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

RightSideBar.propTypes = {
    classes: PropTypes.object,
    selections: PropTypes.array,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    elements: PropTypes.array,
    onNodeError: PropTypes.func,
};

export default withStyles(st)(RightSideBar);
