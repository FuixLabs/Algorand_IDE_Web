import React from 'react';
import {
    Modal,
    Typography,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TablePagination,
    Grid,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import st from './styles/index';
import CopyToClipboard from '../../CopyPopover';
import PropTypes from 'prop-types';
const Dialog = ({ onClose, open, classes, transactions = [], chain, address }) => {
    const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const rowsPerPage = 5;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <Modal open={open} onClose={onClose}>
            <div className={'application-history ' + classes.modal}>
                <div className="header">
                    <Typography className="title">Applications</Typography>
                    <Button
                        href={`https://${chain === 'testnet' ? 'testnet.' : ''}algoexplorer.io/address/${address}`}
                        target="_blank"
                        className="more-info"
                        variant="outlined"
                    >
                        More info
                    </Button>
                    <IconButton className="button-close" variant="contained" onClick={onClose}>
                        <span className="material-icons">close</span>
                    </IconButton>
                </div>

                <TableContainer
                    className={'container-table ' + classes.borderColor}
                    sx={{ maxHeight: 440, bgcolor: 'background.form' }}
                >
                    <Table size="small" stickyHeader>
                        <caption>
                            <Grid container spacing={2}>
                                <Grid
                                    xs={12}
                                    md={8}
                                    lg={8}
                                    sx={{ display: 'flex', alignItems: 'center', paddingLeft: '24px' }}
                                    item
                                >
                                    The data is sorted from the newest to the oldest order
                                </Grid>
                                <Grid xs={12} md={4} lg={4} item>
                                    <TablePagination
                                        rowsPerPageOptions={[5]}
                                        component="div"
                                        count={transactions.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid>
                        </caption>
                        <TableHead className={classes.tableHead}>
                            <TableRow>
                                <TableCell className={classes.borderColor} width={100}>
                                    Application ID
                                </TableCell>
                                <TableCell className={classes.borderColor} width={100}>
                                    Block
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className={classes.tableBody}>
                            {transactions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                            }}
                                            className="table-row"
                                        >
                                            <TableCell className={classes.borderColor} scope="row">
                                                <Typography
                                                    component="a"
                                                    color="primary"
                                                    target="_blank"
                                                    href={`/${chain}/application/${row.id}`}
                                                    className="link"
                                                >
                                                    {row.id}
                                                </Typography>
                                                <CopyToClipboard copyValue={row.id} />
                                            </TableCell>
                                            <TableCell className={classes.borderColor} scope="row">
                                                {row['created-at-round']}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Modal>
    );
};
Dialog.propTypes = {
    classes: PropTypes.object,
    chain: PropTypes.string,
    transactions: PropTypes.array,
    open: PropTypes.bool,
    onClose: PropTypes.func,
    address: PropTypes.string,
};
export default withStyles(st)(Dialog);
