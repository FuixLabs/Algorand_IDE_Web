const st = (theme) => ({
    modal: {
        background: theme.palette.dialog.backgroundColor,
    },
    borderColor: {
        borderColor: theme.palette.divider + ' !important',
    },
    drop: {
        border: '1px solid ' + theme.palette.divider,
        background: theme.palette.action.dropContainer,
        '&:hover': {
            border: '1px solid ' + theme.palette.primary.main,
            background: theme.palette.primary.opacity,
        },
        '&.hover': {
            border: '1px solid ' + theme.palette.primary.main,
            background: theme.palette.primary.opacity,
        },
    },
});
export default st;
