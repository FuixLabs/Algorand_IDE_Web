const st = (theme) => ({
    borderButton: {
        border: '1px solid ' + theme.palette.input.borderColor + '!important',
        '&:hover': {
            borderColor: '#ffffff !important',
        },
    },
    borderInput: {
        border: '1px solid ' + theme.palette.input.borderColor + '!important',
    },
});
export default st;
