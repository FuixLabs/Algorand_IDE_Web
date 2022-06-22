import React from 'react';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import PropTypes from 'prop-types';

const Register = ({ classes }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 45.938 33.628">
            <g id="Group_2157" data-name="Group 2157" transform="translate(10.673 -90.117)">
                <path
                    id="Path_1204"
                    data-name="Path 1204"
                    d="M5.872,105.311c-.578.743-1.373,1.916-.592,2.781a31.851,31.851,0,0,0,3.947,2.416q7.732-4.449,15.452-8.923c-1.31-.725-2.546-1.6-3.923-2.189-2.143-.624-4.391.066-6.454.7A19.7,19.7,0,0,0,5.872,105.311Z"
                    className={classes.register}
                />
                <path
                    id="Path_1205"
                    data-name="Path 1205"
                    d="M-10.207,113.1a11.013,11.013,0,0,0,3.351,4.669,25.835,25.835,0,0,0,11.516,5.18A37.4,37.4,0,0,0,26.2,121.131c3.365-1.485,6.741-3.653,8.374-7.078.907-1.779.637-3.825.7-5.744-3.064,4.434-8.24,6.8-13.319,8.083a40.917,40.917,0,0,1-21.213-.634c-4.406-1.436-8.815-3.782-11.407-7.764A17.459,17.459,0,0,0-10.207,113.1Z"
                    className={classes.register}
                />
                <path
                    id="Path_1206"
                    data-name="Path 1206"
                    d="M2.366,101.15a8.194,8.194,0,0,0,6.577-1.506c.564-.5,1.478-1.478.652-2.157-1.345-1.03-3.219-.844-4.777-.5-1.538.423-3.282,1.131-3.972,2.682C.639,100.555,1.694,100.944,2.366,101.15Z"
                    className={classes.register}
                />
                <path
                    id="Path_1207"
                    data-name="Path 1207"
                    d="M.962,114.2a38.372,38.372,0,0,0,20.947.606c4.269-1.132,8.57-3.047,11.431-6.532a7.872,7.872,0,0,0,1.086-8.6c-1.545-3.072-4.532-5.082-7.541-6.542A36.8,36.8,0,0,0,7.329,90.409a31.4,31.4,0,0,0-10.721,3.2c-2.623,1.429-5.169,3.348-6.472,6.115a7.912,7.912,0,0,0,.981,8.118C-6.47,111.041-2.758,112.943.962,114.2ZM18.694,98.454c2.8-.267,4.945,1.849,7.263,3.054a55.221,55.221,0,0,1-5.481,3.362c-3.775,2.147-7.5,4.392-11.312,6.468-1.394-.882-2.914-1.569-4.241-2.553a2.276,2.276,0,0,1-.28-2.928,12.367,12.367,0,0,1,4.538-4.2A22.1,22.1,0,0,1,18.694,98.454Zm-18.2.066A7.207,7.207,0,0,1,4.128,96.3a8.179,8.179,0,0,1,5.215.035,1.891,1.891,0,0,1,1.351,2.175c-.437,1.667-2.122,2.518-3.607,3.086A8.049,8.049,0,0,1,1,101.508,1.972,1.972,0,0,1,.492,98.52Z"
                    className={classes.register}
                />
            </g>
        </svg>
    );
};
Register.propTypes = {
    classes: PropTypes.object,
};
export default withStyles(st)(Register);