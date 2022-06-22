import React from 'react';
import PropTypes from 'prop-types';
import '../styles/MarkingsTable.scss';
import { withStyles } from '@mui/styles';
import st from '../styles/RegisterForm';
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
    IconButton,
    Grid,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { renderType } from '../../../scripts/util';
const MarkingsTable = ({ node, classes, onDelete, setShow, onEdit, hide, disableAdd, onSave }) => {
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

    const _onEdit = (item) => {
        onEdit(item);
        setShow();
    };

    let cnt = 0;
    let hasMarkings = node.data.markings && node.data.markings.length ? true : false;
    let data = hasMarkings ? filterData(node.data.markings) : [];
    const showAction = onDelete && onEdit ? true : false;
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
                            {!disableAdd && (
                                <Button
                                    color="primary"
                                    className="button-add"
                                    variant="contained"
                                    onClick={setShow}
                                    data-test="test__button-add"
                                >
                                    <AddCircleIcon />
                                    Add New
                                </Button>
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
                                        {showAction && (
                                            <TableCell
                                                className={classes.borderColor}
                                                width={120}
                                                data-test="test__action-cell"
                                            ></TableCell>
                                        )}
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
                                                    {showAction && (
                                                        <TableCell className={classes.borderColor + ' action-cell'}>
                                                            <IconButton
                                                                onClick={() => _onEdit(row)}
                                                                data-test="test__button-edit"
                                                            >
                                                                <span className="material-icons">edit</span>
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() => onDelete(row)}
                                                                data-test="test__button-delete"
                                                            >
                                                                <span className="material-icons">delete</span>
                                                            </IconButton>
                                                        </TableCell>
                                                    )}
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
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    hide: PropTypes.bool,
    disableAdd: PropTypes.bool,
    onSave: PropTypes.func,
};

export default withStyles(st)(MarkingsTable);
