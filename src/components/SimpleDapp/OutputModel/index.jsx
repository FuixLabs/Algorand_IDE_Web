import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactFlow, { Background, ReactFlowProvider, Controls, MiniMap } from 'react-flow-renderer';
import '../styles/Model.scss';
import CustomNodeComponent from './CustomNode';
import StraightEdge from './StraightEdge';
const GAP = 240;
const nodeTypes = {
    default: CustomNodeComponent,
};
const edgeTypes = {
    straight: StraightEdge,
};

Model.propTypes = {
    elements: PropTypes.array,
};

Model.defaultProps = {
    elements: [],
};

let instance;
const onLoad = (reactFlowInstance) => {
    instance = reactFlowInstance;
    setTimeout(() => reactFlowInstance.fitView({ padding: 3 }), 100);
};

function Model(props) {
    const { elements } = props;

    useEffect(() => {
        if (instance && instance.fitView) setTimeout(() => instance.fitView({ padidng: 0.75 }), 300);
    }, [elements]);

    return (
        <div className="output-model-grid">
            <ReactFlowProvider>
                <ReactFlow
                    elements={elements}
                    onLoad={onLoad}
                    nodesConnectable={false}
                    nodesDraggable={false}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    snapGrid={[GAP, GAP]}
                    snapToGrid
                    className="graph-bg"
                >
                    <Controls showInteractive={false} className="controls" />
                    <Background variant="lines" gap={GAP} size={0.2} color="rgba(255, 255, 255, 1)" />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
}

export default Model;
