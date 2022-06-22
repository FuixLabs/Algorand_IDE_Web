import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Background,
    removeElements,
    Controls,
    ControlButton,
} from 'react-flow-renderer';
import nearley from 'nearley';
import guardPostfix from '../../util/guardPostfix.js';
import expressionPostfix from '../../util/expressionPostfix.js';
import LeftSideBar from '../LeftSideBar';
import RightSideBar from '../RightSideBar';
import Header from '../Header';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import Constants from '../../util/Constant';
import CustomEdge from './CustomEdge';
import CustomNodeComponent from './CustomNode';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import Tooltip from '@mui/material/Tooltip';
import ConfirmDialog from './ConfirmDelete';
import PlayerModal from '../PlayerModal';
import modelConstants from '../../redux/constants/model';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { modelActions } from '../../redux/reducer/model';
import { Context } from '../../useContext/index.js';
import ModalShowConflictVariable from './ModalShowConflictVariable.jsx';
import './styles/index.scss';
import { messageActions } from '../../redux/reducer/message.js';
import messageConstants from '../../redux/constants/message.js';
const { UPDATE_MODEL /*UPDATE_INSTANCE*/ } = modelConstants;
const { SHOW_MESSAGE } = messageConstants;
const gap = 240;
function dec2hex(dec) {
    return dec.toString(16).padStart(2, '0');
}
const getId = () => {
    var arr = new Uint8Array(40 / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
};
const nodeTypes = {
    default: CustomNodeComponent,
};
const edgeTypes = {
    default: CustomEdge,
};
const POSITION = [
    { x: gap, y: gap },
    { x: gap, y: 0 },
    { x: gap, y: -gap },
    { x: 0, y: -gap },
    { x: -gap, y: -gap },
    { x: -gap, y: 0 },
    { x: -gap, y: gap },
    { x: 0, y: gap },
];

const WorkBoard = ({ classes }) => {
    const [openYoutubePlaylist, setOpenYoutubePlaylist] = useState(false);

    const toggleYoutubePlaylist = () => {
        setOpenYoutubePlaylist(!openYoutubePlaylist);
    };

    let isExample = window.location.pathname === '/example';
    const reactFlowWrapper = useRef(null);
    // const [reactFlowInstance, setInstance] = useState(null);
    const [selections, setSelections] = useState(null);
    const [open, setOpen] = useState(false);
    const [openConflictModal, setOpenConflictModal] = useState(false);
    const [variableConflict, setVariableConflict] = useState([]);
    const [_elements, setCurrenElement] = useState([]);
    const dispatch = useDispatch();
    const { elements, theme, walletConnect } = useSelector((state) => {
        return { elements: state.model.elements, theme: state.settings.theme, walletConnect: state.walletConnect };
    }, shallowEqual);
    const { reactFlow } = useContext(Context);
    const { state: reactFlowInstance, dispatch: _dispatch } = reactFlow;
    const setInstance = (ref) => {
        _dispatch({ type: 'UPDATE_INSTANCE', ref });
    };
    useEffect(() => {
        let _elements = elements.map((item) => {
            let _item = JSON.parse(JSON.stringify(item));
            if (!Constants.isConnection(item)) {
                if (!_item.className) {
                    _item.className = item.data.typeBlock;
                }
                _item.className += ' ' + classes.block;
                if (selections && selections[0]?.id === _item.id) {
                    _item.className = _item.className.replace('error', '');
                }
            } else {
                if (!_item.className) {
                    _item.className = item.data.typeBlock;
                }
                _item.className += ' ' + classes.connection;
            }
            if (selections && selections[0] && !Constants.isConnection(selections[0])) {
                if (!Constants.isConnection(_item) && _item.data.errorMessage) {
                    _item.className = _item.className ? _item.className.replace('error', '') : '';
                    _item.data.errorMessage = null;
                }
                if (
                    Constants.isConnection(_item) &&
                    (_item.source === selections[0]?.id || _item.target === selections[0]?.id)
                ) {
                    _item.animated = true;
                } else {
                    if (Constants.isConnection(item)) {
                        _item.animated = false;
                    }
                }
            }
            if (!selections || Constants.isConnection(selections[0])) {
                if (Constants.isConnection(_item)) {
                    _item.animated = false;
                }
            }
            return _item;
        });

        setCurrenElement(_elements);
    }, [elements, selections, theme, walletConnect]);
    const setElements = (_elements) => {
        _elements = _elements.map((item) => {
            let _item = { ...item };
            if (!Constants.isConnection(_item)) {
                if (_item.className) {
                    _item.className = _item.className.replace(classes.block, '');
                }
            }
            return _item;
        });
        dispatch(modelActions[UPDATE_MODEL]({ elements: _elements }));
    };
    const onConnect = (params) => {
        let sourceNode = elements.find((item) => item.id === params.source);
        let targetNode = elements.find((item) => item.id === params.target);
        if (
            (Constants.isOperation(sourceNode) && Constants.isOperation(targetNode)) ||
            (Constants.isRegister(sourceNode) && Constants.isRegister(targetNode)) ||
            elements.find(
                (item) =>
                    Constants.isConnection(item) &&
                    ((item.source === params.source && item.target === params.target) ||
                        (item.target === params.source && item.source === params.target))
            )
        ) {
            return;
        }
        if (
            Constants.isOperation(targetNode) &&
            elements.map((item) => (item.target === targetNode.id ? 1 : 0)).reduce((p, c) => p + c, 0) === 3
        ) {
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: 'An operation can only have up to 3 registers coming in ',
                    severity: 'warning',
                })
            );
            return;
        }
        if (
            Constants.isOperation(sourceNode) &&
            elements.map((item) => (item.source === sourceNode.id ? 1 : 0)).reduce((p, c) => p + c, 0) === 3
        ) {
            dispatch(
                messageActions[SHOW_MESSAGE]({
                    message: 'An operation can only have up to 3 registers coming out ',
                    severity: 'warning',
                })
            );
            return;
        }
        params.label = Constants.isOperation(sourceNode) ? 'Expression' : 'Variable';
        params.data = {
            typeBlock: Constants.connection.type,
            label: params.label,
        };
        if (Constants.isOperation(sourceNode)) {
            params.data.expressions = [];
        } else {
            params.data.variables = [];
        }
        params.type = 'straight';
        let _elements = JSON.parse(JSON.stringify(elements));
        _elements = addEdge(params, _elements);
        setElements(_elements);
    };

    const onElementsRemove = (elementsToRemove) => {
        let _elements = JSON.parse(JSON.stringify(elements));
        setElements(removeElements(elementsToRemove, _elements));
    };

    const onLoad = (_reactFlowInstance) => {
        setInstance(_reactFlowInstance);
        setTimeout(() => {
            _reactFlowInstance.fitView();
            // dispatch(modelActions[UPDATE_INSTANCE]({ ref: _reactFlowInstance }));
        }, 0);
    };

    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };
    const positionIsExist = (position) => {
        for (let i = 0; i < elements.length; i++) {
            let node = elements[i];
            if (!Constants.isConnection(node) && node.position.x === position.x && node.position.y === position.y) {
                return true;
            }
        }
        return false;
    };
    const onDrop = (event) => {
        event.preventDefault();
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData(Constants.nodeType);
        let position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        position.x = position.x + 70;
        position.y = position.y + 70;
        let cnt = 0;
        while (true) {
            if (!positionIsExist(position)) {
                break;
            }
            cnt++;
            let newPosition;
            for (let i = 0; i < POSITION.length; i++) {
                let x = position.x + POSITION[i].x * cnt;
                let y = position.y + POSITION[i].y * cnt;

                if (newPosition) {
                    //find position nearest
                    if (
                        !positionIsExist({ x, y }) &&
                        Math.pow(x - position.x, 2) + Math.pow(y - position.y, 2) <=
                            Math.pow(newPosition.x - position.x, 2) + Math.pow(newPosition.y - position.y, 2)
                    ) {
                        newPosition = { x, y };
                    }
                } else {
                    newPosition = { x, y };
                }
            }
            if (!positionIsExist(newPosition)) {
                position = newPosition;
                break;
            }
        }
        if (!Constants[type]) return;

        const newNode = {
            id: getId(),
            type: 'default',
            position,
            data: {
                label: Constants[type].label,
                type: [{}],
                guard: '',
                markings: [],
                typeBlock: Constants[type].type,
            },
            className: type + ' ' + classes.block,
        };
        if (Constants[type].type === Constants['register'].type) {
            newNode.data.tokenIcon = Constants.tokenIcon;
        }

        let _elements = JSON.parse(JSON.stringify(elements));
        _elements.push(newNode);
        setElements(_elements);
    };
    const onSelectionChange = (event) => {
        setSelections(event);
        if (event && event[0]) {
            let found = elements.find((item) => item.id === event[0].id);
            if (found && found.className?.indexOf('error') >= 0) {
                clearNodeError(event[0].id);
            }
        }
    };
    const onSave = (node) => {
        if (!Array.isArray(node)) {
            node = [node];
        }
        let _node = JSON.parse(JSON.stringify(node));
        let _elements = JSON.parse(JSON.stringify(countEl.current));
        _node.forEach((item) => {
            if (!item.id) {
                return;
            }
            let index = _elements.findIndex((_item) => _item.id === item.id);

            if (_elements[index] && !item.className) {
                item.className = item.data.typeBlock;
            }
            _elements[index] = item;
        });
        if (selections && _node.find((item) => item.id === selections[0]?.id)) {
            setSelections([_node.find((item) => item.id === selections[0]?.id)]);
        }
        setElements(_elements);
    };
    const onDelete = (node) => {
        let _selections = JSON.parse(JSON.stringify(selections));
        _selections = _selections.filter((item, index) => {
            return item.id !== node.id;
        });
        onElementsRemove([node]);
        setSelections(_selections);
    };
    const onOpen = () => {
        setOpen(true);
    };
    const onClearAll = () => {
        setOpen(false);
        setElements([]);
        setSelections(null);
        window.localStorage.setItem('elements', []);
    };
    const onNodeDragStop = (e, node) => {
        let _elements = JSON.parse(JSON.stringify(elements));
        let key,
            _positionIsExist = false;
        _elements.forEach((item, index) => {
            if (Constants.isConnection(item)) {
                return;
            }
            if (item.id === node.id) {
                key = index;
            }
            if (item.position.x === node.position.x && item.position.y === node.position.y) {
                _positionIsExist = true;
            }
        });
        if (!_positionIsExist) {
            _elements[key].position = node.position;
        } else {
            //if position has node, update id this node
            let oldId = _elements[key].id;
            _elements[key].id = getId();
            _elements.forEach((item) => {
                if (Constants.isConnection(item)) {
                    if (item.source === oldId) {
                        item.source = _elements[key].id;
                    }
                    if (item.target === oldId) {
                        item.target = _elements[key].id;
                    }
                }
            });
        }
        if (selections && selections[0].id === node.id) {
            setSelections([node]);
        }
        setElements(_elements);
    };

    const countEl = useRef(elements);
    countEl.current = elements;
    const onNodeError = function (ids = [], message = []) {
        if (typeof ids === 'string') {
            ids = [ids];
        }
        if (typeof message === 'string') {
            let tmp = message;
            ids.forEach((item, index) => (message[index] = tmp));
        }
        let _elements = JSON.parse(JSON.stringify(countEl.current));
        _elements = _elements.map((item, index) => {
            if (!item.className) {
                item.className = '';
            }
            if (ids.includes(item.id)) {
                if (item.className?.indexOf('error') < 0) {
                    item.className += ' error';
                    item.data.errorMessage = message[index];
                }
            } else {
                item.className = item.className ? item.className.replace('error', '') : '';
                item.data.errorMessage = null;
            }
            return item;
        });

        setElements(_elements);
    };

    const clearNodeError = (id) => {
        let _elements = JSON.parse(JSON.stringify(elements));
        if (id) {
            _elements = _elements.map((item, index) => {
                if (item.id === id) {
                    item.className = item.className ? item.className.replace('error', '') : '';
                    item.data.errorMessage = null;
                }
                return item;
            });
        } else {
            _elements = _elements.map((item, index) => {
                item.className = item.className ? item.className.replace('error', '') : '';
                item.data.errorMessage = null;
                return item;
            });
        }
        setElements(_elements);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleCloseConflictModal = () => {
        setVariableConflict([]);
        setOpenConflictModal(false);
    };
    const convert = () => {
        if (!verifyModel()) {
            return {};
        }
        let _elements = JSON.parse(JSON.stringify(elements));
        const places = [];
        const transitions = [];
        const nodes = [];
        const uidToNodeId = {};
        const placeToTransition = {};
        const transitionToPlace = {};
        const placeIdFromNodeId = {};

        let hasError = false;

        _elements.forEach((item) => {
            nodes.push(Object.assign(item?.data, { id: item.id }));
            uidToNodeId[item?.id] = nodes.length - 1;
            switch (item?.data?.typeBlock) {
                case 'register': {
                    places.push(nodes.length - 1);
                    placeIdFromNodeId[nodes.length - 1] = places.length - 1;
                    break;
                }
                case 'operation': {
                    transitions.push(nodes.length - 1);
                    break;
                }
                case 'connection': {
                    nodes[nodes.length - 1].source = item?.source;
                    nodes[nodes.length - 1].target = item?.target;
                    break;
                }
                default: {
                    return;
                }
            }
        });

        const getNodeIdFromUID = (uid) => {
            return uidToNodeId?.[uid];
        };

        const getNodeType = (node) => {
            return node.typeBlock;
        };

        const isRegister = (node) => {
            return getNodeType(node) === 'register';
        };

        // const isOperation = (node) => {
        //   return getNodeType(node) === 'operation';
        // };

        const isConnection = (node) => {
            return getNodeType(node) === 'connection';
        };

        const getSourceNode = (connectionNode) => {
            return nodes?.[getNodeIdFromUID(connectionNode?.source)];
        };

        nodes.forEach((node) => {
            if (isConnection(node)) {
                if (isRegister(getSourceNode(node))) {
                    if (!placeToTransition[getNodeIdFromUID(node?.target)]) {
                        placeToTransition[getNodeIdFromUID(node?.target)] = [
                            {
                                placeNodeId: getNodeIdFromUID(node?.source),
                                node,
                            },
                        ];
                    } else {
                        placeToTransition[getNodeIdFromUID(node?.target)].push({
                            placeNodeId: getNodeIdFromUID(node?.source),
                            node,
                        });
                    }
                } else {
                    node?.expressions?.forEach((expression) => {
                        let str = expression.value;
                        let parser = new nearley.Parser(nearley.Grammar.fromCompiled(expressionPostfix));
                        try {
                            parser.feed(str);
                            if (!parser.results || !parser.results[0]) {
                                hasError = true;
                                onNodeError(node.id, 'Wrong expression');
                            } else {
                                str = parser.results[0][0];
                            }
                        } catch (err) {
                            hasError = true;
                            onNodeError(node.id, 'Wrong expression');
                        }
                        expression.value = str;
                    });
                    if (!transitionToPlace[getNodeIdFromUID(node?.source)]) {
                        transitionToPlace[getNodeIdFromUID(node?.source)] = [
                            {
                                placeNodeId: getNodeIdFromUID(node?.target),
                                node,
                            },
                        ];
                    } else {
                        transitionToPlace[getNodeIdFromUID(node?.source)].push({
                            placeNodeId: getNodeIdFromUID(node?.target),
                            node,
                        });
                    }
                }
            }
        });

        const COLOR = {
            STRING: 2,
            INT: 3,
            BOOLEAN: 4,
        };
        const getNode = (nodeId) => {
            return nodes[nodeId];
        };

        const placeToColor = {};
        const Markings = [];
        const t = transitions.length;
        const guards = [];
        const variables = [];
        const expressions = [];
        const placePermission = {};

        const indexToPlaceId = [];
        const indexToTransitionId = [];

        places.forEach((nodeId) => {
            const node = getNode(nodeId);
            indexToPlaceId.push(node.id);

            placeToColor[placeIdFromNodeId[nodeId]] = [];
            placePermission[placeIdFromNodeId[nodeId]] = node.allowAddData ? true : false;
            node?.type?.forEach((item) => {
                placeToColor[placeIdFromNodeId[nodeId]].push(COLOR[item.value]);
            });

            Markings.push(
                node?.markings
                    ?.map((marking) => {
                        return (
                            '[' +
                            marking?.tokens
                                ?.map((value, index) => {
                                    if (placeToColor[placeIdFromNodeId[nodeId]][index] == '2') value = `'${value}'`;
                                    if (placeToColor[placeIdFromNodeId[nodeId]][index] == '4')
                                        value = value ? 'True' : 'False';
                                    return value;
                                })
                                .join(',') +
                            ']'
                        );
                    })
                    .join(',') || ''
            );
        });

        transitions.forEach((nodeId, id) => {
            const node = getNode(nodeId);
            indexToTransitionId.push(node.id);
            let guard = node.guard;
            if (guard?.length) {
                let parser = new nearley.Parser(nearley.Grammar.fromCompiled(guardPostfix));
                try {
                    parser.feed(guard);
                    if (!parser.results || !parser.results[0]) {
                        hasError = true;
                        onNodeError(node.id, 'Wrong expression');
                    } else {
                        guard = parser.results[0][0];
                    }
                } catch (err) {
                    hasError = true;
                    onNodeError(node.id, 'Wrong expression');
                }
            }

            guards.push(guard);

            placeToTransition[nodeId] = placeToTransition?.[nodeId]?.sort((a, b) => a.placeNodeId - b.placeNodeId);
            variables[id] = [];
            placeToTransition?.[nodeId]?.forEach((item) => {
                variables[id].push([
                    placeIdFromNodeId[item.placeNodeId],
                    item?.node?.variables
                        ?.map(({ value }) => {
                            return value;
                        })
                        .join(),
                ]);
            });

            transitionToPlace[nodeId] = transitionToPlace?.[nodeId]?.sort((a, b) => a.placeNodeId - b.placeNodeId);
            expressions[id] = [];
            transitionToPlace?.[nodeId]?.forEach((item) => {
                expressions[id].push([
                    placeIdFromNodeId[item.placeNodeId],
                    `[ ${item?.node?.expressions
                        ?.map(({ value }) => {
                            return value;
                        })
                        .join(' , ')} ]`,
                ]);
            });
        });

        if (hasError) return false;

        //make sure deployed model not have a any animated edge
        const newElements = elements.map((element) => {
            if (Constants.isConnection(element)) return { ...element, animated: false };
            return element;
        });

        return {
            elements: newElements,
            computeEngine: {
                Markings,
                Expressions: expressions,
                Guards: guards,
                T: t,
                Variables: variables,
                placeToColor,
                placePermission,
                uidToNodeId,
                indexToPlaceId,
                indexToTransitionId,
            },
        };
    };

    const verifyModel = () => {
        let error = Constants.verifyModel(elements, true);

        if (error.length) {
            let ids = error.map((item) => item.id);
            onNodeError(ids);
            return false;
        }
        return true;
    };
    return (
        <div className="work-board">
            <Header
                convert={convert}
                elements={elements}
                isExample={isExample}
                toggleYoutubePlaylist={toggleYoutubePlaylist}
            />
            <div className="body-work-board">
                <LeftSideBar isExample={isExample} />
                <ReactFlowProvider>
                    <div className={'wrapper ' + classes.wrapper} ref={reactFlowWrapper}>
                        <ReactFlow
                            elements={_elements}
                            onConnect={onConnect}
                            onElementsRemove={onElementsRemove}
                            onLoad={onLoad}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onSelectionChange={onSelectionChange}
                            nodeTypes={nodeTypes}
                            edgeTypes={edgeTypes}
                            onNodeDragStop={onNodeDragStop}
                            snapToGrid={true}
                            snapGrid={[gap, gap]}
                            // defaultZoom={0.5}
                        >
                            <Controls className={classes.controls + ' ' + (!isExample ? 'fix-controls-button' : '')}>
                                {!isExample ? (
                                    <ControlButton className="button-clear" onClick={onOpen}>
                                        <Tooltip title="Clear all components" placement="right">
                                            <span>
                                                <DeleteSweepIcon />
                                            </span>
                                        </Tooltip>
                                    </ControlButton>
                                ) : (
                                    ''
                                )}
                            </Controls>
                            <Background variant="lines" gap={gap} size={0.2} color="rgba(255, 255, 255, 1)" />
                        </ReactFlow>
                    </div>
                </ReactFlowProvider>
                <RightSideBar
                    onNodeError={onNodeError}
                    selections={selections}
                    onSave={onSave}
                    onDelete={onDelete}
                    elements={_elements}
                />
                <ConfirmDialog open={open} handleClose={handleClose} onOk={onClearAll} />
                <ModalShowConflictVariable
                    variableConflict={variableConflict}
                    open={openConflictModal}
                    handleClose={handleCloseConflictModal}
                    elements={_elements}
                />
            </div>
            <PlayerModal open={openYoutubePlaylist} onToggleModal={toggleYoutubePlaylist} />
        </div>
    );
};

WorkBoard.propTypes = { classes: PropTypes.object };
export default withStyles(st)(WorkBoard);
