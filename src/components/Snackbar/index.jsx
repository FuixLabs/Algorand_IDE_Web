import React, { useEffect, useState } from 'react';
import { Snackbar, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import PropTypes from 'prop-types';
import constants from '../../redux/constants/message';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { messageActions } from '../../redux/reducer/message';
const { HIDE_MESSAGE } = constants;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}
let length = 0;

const Mess = ({}) => {
    const [transition, setTransition] = useState(true);
    const dispatch = useDispatch();
    const state = useSelector((state) => {
        return state.message;
    }, shallowEqual);
    let { message, open, autoHideDuration, severity, createAt } = state;
    const handleClose = (reason, index) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(messageActions[HIDE_MESSAGE]({ index }));
    };
    useEffect(() => {
        if (open.length < length) {
            setTransition(false);
        } else {
            setTransition(true);
        }
        length = open.length;
    }, [open]);
    let now = Date.now();
    return (
        <>
            {open.map((item, index) => {
                let props = {};
                if (!transition) {
                    props.transitionDuration = 0;
                }

                return (
                    <Snackbar
                        open={item}
                        autoHideDuration={createAt[index] + autoHideDuration[index] - now}
                        onClose={(e, r) => handleClose(r, index)}
                        sx={{
                            bottom: `${24 + 60 * (open.length - index - 1)}px !important`,
                            transition: 'bottom 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
                        }}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        key={createAt[index]}
                        TransitionComponent={TransitionUp}
                        {...props}
                    >
                        <Alert
                            onClose={() => handleClose(null, index)}
                            severity={severity[index]}
                            sx={{ minWidth: '300px' }}
                        >
                            {message[index]}
                        </Alert>
                    </Snackbar>
                );
            })}
        </>
    );
};
Mess.propTypes = {
    classes: PropTypes.object,
};
export default Mess;
