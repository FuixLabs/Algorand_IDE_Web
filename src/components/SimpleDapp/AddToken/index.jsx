import React, { useEffect, useState, useRef } from 'react';
import './styles/AddToken.scss';
import { Box, Button, InputAdornment, OutlinedInput, Typography, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Constant from '../../../util/Constant';
import useShallowEqualSelector from '../../../redux/customHook/useShallowEqualSelector';
import AddTokenForm from './AddTokenForm';

function AddToken() {
    const elements = useShallowEqualSelector((state) => state.dapp.pElements);
    const [elementSelectedId, setElementSelectedId] = useState('');
    const [filteredElements, setFilteredElements] = useState(() => {
        return elements.filter((item) => Constant.isRegister(item));
    });
    const [searchValue, setSearchValue] = useState('');
    const [openModal, setOpenModal] = useState(false);

    const selectPlace = (id) => {
        return () => {
            setElementSelectedId(id);
            setOpenModal(true);
        };
    };

    const closeModal = () => {
        setOpenModal(false);
        setElementSelectedId('');
    };

    const handleChangeSearch = (event) => {
        const val = event.target.value;
        setSearchValue(val);
        filterData(val);
    };

    const filterData = (val) => {
        if (!val?.trim()) setFilteredElements(elements);
        setFilteredElements(
            elements.filter(
                (item) => Constant.isRegister(item) && item.data.label?.toLowerCase().includes(val?.toLowerCase())
            )
        );
    };

    // update display data if computeEngine changed
    useEffect(() => {
        filterData(searchValue);
    }, [elements]);

    return (
        <>
            <Typography color="textSecondary">Please choose a register to add token.</Typography>
            <OutlinedInput
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
                placeholder="Register"
                className="search-input"
                fullWidth
                onChange={handleChangeSearch}
                value={searchValue}
                size="small"
            />
            <Box
                className="container"
                sx={{
                    width: {
                        xs: '80vw',
                        lg: '40vw',
                    },
                    maxHeight: '60vh',
                }}
            >
                {filteredElements.length === 0 && <Typography>No registers found.</Typography>}
                {filteredElements.map((item, index) => (
                    <Button
                        className="register-item"
                        key={index}
                        onClick={selectPlace(item.id)}
                        variant="contained"
                        color="secondary"
                    >
                        <Typography>{item.data?.label}</Typography>
                        <Box
                            sx={{
                                bgcolor: 'secondary.dark',
                            }}
                            className="number-of-tokens"
                        >
                            {item.data?.markings?.length || '0'}
                        </Box>
                    </Button>
                ))}
            </Box>
            <AddTokenForm
                open={openModal && Boolean(elementSelectedId?.length)}
                handleClose={closeModal}
                node={elementSelectedId ? elements.find((item) => item.id === elementSelectedId) : null}
            />
        </>
    );
}

export default AddToken;
