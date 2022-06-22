import React from 'react';
import PropTypes from 'prop-types';
import '../styles/index.scss';
import { withStyles } from '@mui/styles';
import st from '../styles/RegisterForm';
import { Button, Typography } from '@mui/material';
import Header from '../Header';
import DescriptionTab from './RegisterFormDescriptionTab';
import RegisterFormMarkingsDialog from './RegisterFormMarkingsDialog';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const RegisterForm = ({ node, onSave, onDelete, elements, onNodeError }) => {
    const [open, setOpen] = React.useState(false);
    const handleChangeOpen = () => {
        setOpen(!open);
    };
    return (
        <div className="register-container" data-test="test__container-register-form">
            <Header title="Edit Register">
                {/* temporary disable due to contract v1 doesnt handle added tokens from workboard */}
                {/* <Button
                    variant="outlined"
                    className="button-add-markings"
                    onClick={handleChangeOpen}
                    // disabled={
                    //   !node.data.type ||
                    //   !node.data.type.length ||
                    //   !node.data.type[0].value
                    // }
                    data-test="test__button-open-dialog"
                >
                    <Typography className="text" component="span" color="inherit">
                        <AddCircleIcon />
                        Add Markings
                    </Typography>
                </Button> */}
            </Header>
            <DescriptionTab
                node={node}
                onSave={onSave}
                onDelete={onDelete}
                elements={elements}
                onNodeError={onNodeError}
            />
            <RegisterFormMarkingsDialog open={open} node={node} onSave={onSave} handleClose={handleChangeOpen} />
        </div>
    );
};

RegisterForm.propTypes = {
    node: PropTypes.object,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    elements: PropTypes.array,
    onNodeError: PropTypes.func,
};

export default withStyles(st)(RegisterForm);
