import React from 'react';
import PropTypes from 'prop-types';
import { Handle } from 'react-flow-renderer';
import { Typography } from '@mui/material';
import Operation from '../../Icons/Operation';
import Register from '../../Icons/Register';

CustomNodeComponent.propTypes = {
    data: PropTypes.object,
    isConnectable: PropTypes.any,
};

export default function CustomNodeComponent({ data, isConnectable }) {
    return (
        <>
            <div className="block">
                <Handle type="target" id="target-1" position="top" className="port-in" isConnectable={isConnectable} />
                <Handle type="target" id="target-2" position="left" className="port-in" isConnectable={isConnectable} />

                <div className="content">
                    {data.typeBlock === 'operation' ? <Operation /> : <Register />}
                    <Typography className={'name'}>{data.label}</Typography>
                </div>

                <Handle
                    type="source"
                    id="source-1"
                    position="bottom"
                    className="port-out"
                    isConnectable={isConnectable}
                />
                <Handle
                    type="source"
                    id="source-2"
                    position="right"
                    className="port-out"
                    isConnectable={isConnectable}
                />
            </div>
        </>
    );
}
