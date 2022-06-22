import React from 'react';
import PropTypes from 'prop-types';
import '../../../RightSideBar/styles/MarkingsTable.scss';
import { withStyles } from '@mui/styles';
import st from '../../../RightSideBar/styles/RegisterForm';
import {
    Typography,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    TablePagination,
    InputAdornment,
    OutlinedInput,
    FormControl,
    Box,
    Tooltip,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { renderType } from '../../../../scripts/util';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
const MarkingsTable = ({ node, classes, setShow, hide, waitForFiring }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const onSearch = (event) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filterData = (data) => {
        let newData = data;
        if (search) {
            newData = data.filter((item) => {
                for (let i = 0; i < item.tokens.length; i++) {
                    if (item?.tokens[i]?.toString()?.toUpperCase()?.indexOf(search.toUpperCase()) >= 0) {
                        return true;
                    }
                }
                return false;
            });
        }
        return newData;
    };

    let cnt = 0;
    let hasMarkings = node.data.markings && node.data.markings.length ? true : false;
    let data = hasMarkings ? filterData(node.data.markings) : [];
    if (hide) return '';
    return (
        <div className="table-marking" data-test="test__container-table">
            {node.data.type && node.data.type[0] && node.data.type[0].value ? (
                <>
                    <div className="grid-container">
                        <div className="header-form">
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <OutlinedInput
                                    placeholder="Search"
                                    className={classes.borderInput + ' input-search'}
                                    value={search}
                                    onChange={onSearch}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <SearchIcon />
                                        </InputAdornment>
                                    }
                                    data-test="test__search"
                                />
                            </FormControl>
                            {node.data.allowAddData && (
                                <Box className="add-container">
                                    <Button
                                        color="primary"
                                        className="button-add"
                                        variant="contained"
                                        onClick={setShow}
                                        data-test="test__button-add"
                                        disabled={waitForFiring}
                                    >
                                        <AddCircleIcon />
                                        Add New
                                    </Button>
                                    {waitForFiring && (
                                        <Tooltip
                                            title={'You must execute all firing transactions before adding new token.'}
                                        >
                                            <ContactSupportRoundedIcon className="help-icon" color="primary" />
                                        </Tooltip>
                                    )}
                                </Box>
                            )}
                        </div>
                        <TableContainer
                            className={'container-table ' + classes.borderColor}
                            sx={{ maxHeight: 440, bgcolor: 'background.form' }}
                        >
                            <Table size="small">
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell className={classes.borderColor} width={100}>
                                            No.
                                        </TableCell>
                                        {node.data.type.map((item, index) => {
                                            return (
                                                <TableCell
                                                    className={classes.borderColor}
                                                    key={index}
                                                    data-test="test__type_cell"
                                                >
                                                    {renderType(item.value, item.description)}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tableBody}>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            cnt++;
                                            return (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                    }}
                                                    data-test="test__marking-row"
                                                >
                                                    <TableCell
                                                        className={classes.borderColor}
                                                        scope="row"
                                                        key={-2}
                                                        sx={{ color: 'text.primary' }}
                                                    >
                                                        {row.total}
                                                    </TableCell>
                                                    {row.tokens.map((cell, _index) => {
                                                        return (
                                                            <TableCell
                                                                className={classes.borderColor}
                                                                scope="row"
                                                                key={_index}
                                                                sx={{ color: 'text.primary' }}
                                                            >
                                                                {node.data.type[_index].value !== 'BOOLEAN'
                                                                    ? cell
                                                                    : cell.toString() === 'true'
                                                                    ? 'True'
                                                                    : 'False'}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {cnt ? (
                            <TablePagination
                                className={'footer-table ' + classes.borderColor}
                                rowsPerPageOptions={[5, 10, 20]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        ) : (
                            <div className="not-found" data-test="test__dot-not-has-markings">
                                <Typography color="textPrimary">
                                    <FindInPageIcon />
                                </Typography>
                                <Typography color="textPrimary">No records found.</Typography>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
};

MarkingsTable.propTypes = {
    node: PropTypes.object,
    classes: PropTypes.object,
    setShow: PropTypes.func,
    hide: PropTypes.bool,
    waitForFiring: PropTypes.bool,
};

export default withStyles(st)(MarkingsTable);
