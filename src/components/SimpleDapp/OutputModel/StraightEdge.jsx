import PropTypes from 'prop-types';
import React from 'react';
import { ArrowHeadType, getMarkerEnd } from 'react-flow-renderer';

CustomEdge.propTypes = {
    id: PropTypes.string.isRequired,
    sourceX: PropTypes.number.isRequired,
    sourceY: PropTypes.number.isRequired,
    targetX: PropTypes.number.isRequired,
    targetY: PropTypes.number.isRequired,
    style: PropTypes.object,
    arrowHeadType: PropTypes.string,
    markerEndId: PropTypes.string,
};

CustomEdge.defaultProps = {
    style: {},
    arrowHeadType: '',
    markerEndId: '',
};

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY, style, markerEndId }) {
    const markerEnd = getMarkerEnd(ArrowHeadType.ArrowClosed, markerEndId);

    return (
        <path
            id={id}
            style={style}
            className="react-flow__edge-path"
            d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
            markerEnd={markerEnd}
        />
    );
}
