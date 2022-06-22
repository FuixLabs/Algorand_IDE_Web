import React from 'react';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import PropTypes from 'prop-types';

const LogoQ = ({ classes }) => {
    return (
        <svg
            className={classes.logoQ}
            xmlns="http://www.w3.org/2000/svg"
            width="34.445"
            height="37.386"
            viewBox="0 0 34.445 37.386"
        >
            <g id="Group_90080" data-name="Group 90080" transform="translate(0.5 0.501)">
                <path
                    id="Subtraction_79"
                    data-name="Subtraction 79"
                    d="M16.723,36.386a2.339,2.339,0,0,1-1.131-.291L1.13,28.083A2.16,2.16,0,0,1,0,26.205V10.181A2.16,2.16,0,0,1,1.13,8.3L15.592.291a2.345,2.345,0,0,1,2.261,0L32.315,8.3a2.16,2.16,0,0,1,1.13,1.878V26.205a2.16,2.16,0,0,1-1.13,1.878L17.853,36.1A2.339,2.339,0,0,1,16.723,36.386Zm0-14.776c3.4,2.657,6.028,4.708,7.811,6.094v-4.86L8.916,10.675v4.861L13.6,19.18,8.916,22.844V27.7l7.811-6.094Zm7.811-10.936L18.4,15.438l3.124,2.431,3.009-2.333V10.675ZM16.727,8.682a1.992,1.992,0,1,0,1.992,1.992A1.995,1.995,0,0,0,16.727,8.682Z"
                    transform="translate(0 -0.001)"
                    className="background-logo"
                    stroke="rgba(0,0,0,0)"
                    strokeMiterlimit="10"
                    strokeWidth="1"
                />
            </g>
        </svg>
    );
};
LogoQ.propTypes = {
    classes: PropTypes.object,
};
export default withStyles(st)(LogoQ);
