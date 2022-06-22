import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './styles/UploadIcon.scss';
import { withStyles } from '@mui/styles';
import st from './styles/RegisterForm';
import { Typography, Button, Skeleton } from '@mui/material';
import Constants from '../../util/Constant';
let MAX_WIDTH = 256,
    MAX_HEIGHT = 256;
const MarkingsTable = ({ node, classes, onSave, handleUploadFile, onRemove }) => {
    const [loading, setLoading] = useState(true);
    const [sizeError, setError] = useState(false);
    const ref = useRef();
    const getSize = async (src) => {
        var img = document.createElement('img');
        img.src = src;
        const myPromise = new Promise((resolve, reject) => {
            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                resolve({ width, height });
            };
            img.onerror = reject;
        });
        return myPromise;
    };
    const _handleUploadFile = (e) => {
        if (!e.target.files[0]) {
            return;
        }
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (event) => {
            let { width, height } = await getSize(event.target.result);
            if (width > MAX_WIDTH) {
                setError(true);
                return;
            }
            if (height > MAX_HEIGHT) {
                setError(true);
                return;
            }
            setError(false);
            handleUploadFile(file, () => {
                setLoading(true);
            });
        };
    };
    const _onRemove = () => {
        ref.current.value = '';
        onRemove();
    };
    const onLoad = () => {
        setLoading(false);
    };
    return (
        <div className="container-upload-icon">
            <Typography color="primary" className="title-form">
                ICON OF MESSAGE
            </Typography>
            <div className="body">
                <div className="upload-icon">
                    <div className={'icon ' + classes.icon}>
                        {node.data.tokenIcon ? (
                            <>
                                <img src={node.data.tokenIcon} onLoad={onLoad} alt="icon" key={node.data.tokenIcon} />
                                {loading ? (
                                    <Skeleton variant="circular" width={90} height={90} className="skeleton" />
                                ) : (
                                    ''
                                )}
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                    <input
                        accept=".png, .jpg, .jpeg"
                        id="flat-button-file"
                        multiple
                        type="file"
                        onChange={_handleUploadFile}
                        className="input"
                        ref={ref}
                    />
                    <Typography
                        component="label"
                        htmlFor="flat-button-file"
                        className={'button-upload ' + (node.data.tokenIcon ? 'has-icon' : '')}
                    >
                        <span className="material-icons">add_a_photo</span>Upload icon
                    </Typography>
                </div>
                <div className="right">
                    {node.data.tokenIcon !== Constants.tokenIcon ? (
                        <Button variant="outlined" color="secondary" className="button-remove" onClick={_onRemove}>
                            REMOVE ICON
                        </Button>
                    ) : (
                        ''
                    )}
                    <Typography className="des">
                        Allowed *.png, *.jpg, *.jpeg <br />{' '}
                        <Typography color={sizeError ? 'error' : ''} component="span">
                            {' '}
                            Maximum size: {MAX_WIDTH}px x {MAX_HEIGHT}px
                        </Typography>
                    </Typography>
                </div>
            </div>
        </div>
    );
};

MarkingsTable.propTypes = {
    node: PropTypes.object,
    classes: PropTypes.object,
    onSave: PropTypes.func,
    handleUploadFile: PropTypes.func,
    onRemove: PropTypes.func,
};

export default withStyles(st)(MarkingsTable);
