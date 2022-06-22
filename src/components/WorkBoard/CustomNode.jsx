import React from 'react';
import PropTypes from 'prop-types';
import { Handle } from 'react-flow-renderer';
import { Typography } from '@mui/material';
import Operation from '../Icons/Operation';
import Register from '../Icons/Register';
import st from './styles/CustomNode';
import Tooltip from '@mui/material/Tooltip';
import { withStyles } from '@mui/styles';
CustomNodeComponent.propTypes = {
    data: PropTypes.object,
    classes: PropTypes.object,
    isConnectable: PropTypes.any,
};

function CustomNodeComponent({ data, classes, isConnectable }) {
    return (
        <Tooltip title={data.errorMessage || ''} placement="right-start" open={Boolean(data.errorMessage)}>
            <div className="block">
                <Handle type="target" id="target-1" position="top" className="port-in" isConnectable={isConnectable}>
                    <span className="material-icons input-icon">east</span>
                </Handle>
                <Handle type="target" id="target-2" position="left" className="port-in" isConnectable={isConnectable}>
                    <span className="material-icons input-icon">east</span>
                </Handle>
                <div className="content">
                    {data.typeBlock === 'operation' ? <Operation /> : <Register />}
                    <Typography className={'name ' + classes[data.typeBlock]}>{data.label}</Typography>
                </div>
                <Handle
                    type="source"
                    id="source-1"
                    position="bottom"
                    className="port-out"
                    isConnectable={isConnectable}
                >
                    <span className="material-icons output-icon">east</span>
                </Handle>
                <Handle type="source" id="source-2" position="right" className="port-out" isConnectable={isConnectable}>
                    <span className="material-icons output-icon">east</span>
                </Handle>
            </div>
        </Tooltip>
    );
}
export default withStyles(st)(CustomNodeComponent);
