import React from 'react';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import PropTypes from 'prop-types';

const HashIcon = ({ classes }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g id="Group_77591" data-name="Group 77591" transform="translate(-1570.149 -25.393)">
                <g id="Group_75332" data-name="Group 75332" transform="translate(1570.149 25.392)">
                    <g id="Group_69366" data-name="Group 69366" transform="translate(0 0)">
                        <rect
                            id="Rectangle_145638"
                            data-name="Rectangle 145638"
                            width="24"
                            height="24"
                            fill="rgba(0,0,0,0)"
                        />
                        <g id="Group_77615" data-name="Group 77615">
                            <path
                                id="Subtraction_65"
                                data-name="Subtraction 65"
                                d="M13.77,18.33H1a1,1,0,0,1-1-1V4.583H4.615V0H13.77a1,1,0,0,1,1,1V17.33A1,1,0,0,1,13.77,18.33Zm-11.9-7.924a3.172,3.172,0,0,0,3.18,3.157H6.953V14.4l1.7-1.894-1.7-1.894v.842H4.425A3.608,3.608,0,0,1,1.866,10.406ZM8.234,8.851h2.507A3.581,3.581,0,0,1,13.28,9.894a3.1,3.1,0,0,0-.925-2.212,3.143,3.143,0,0,0-2.229-.918H8.234V5.928L6.552,7.807,8.234,9.685V8.852Z"
                                transform="translate(4.615 2.834)"
                                className={classes.fill}
                            />
                            <path
                                id="Path_48985"
                                data-name="Path 48985"
                                d="M857.537,229.625H854l3.537-3.562Zm0,0"
                                transform="translate(-849.279 -222.932)"
                                className={classes.fill}
                            />
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    );
};
HashIcon.propTypes = {
    classes: PropTypes.object,
};
export default withStyles(st)(HashIcon);
