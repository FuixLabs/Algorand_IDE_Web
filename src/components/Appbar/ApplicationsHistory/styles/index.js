const st = (theme) => {
    return {
        info: {
            background: theme.palette.primary.main,
            minWidth: 20,
            minHeight: 20,
            borderRadius: '50%',
            padding: 2,
            position: 'absolute',
            top: 0,
            right: 0,
            '& p': {
                fontSize: 12,
                color: theme.palette.primary.contrastText,
            },
        },
        modal: {
            background: theme.palette.dialog.backgroundColor,
        },
        borderColor: {
            borderColor: theme.palette.divider + ' !important',
        },
    };
};
export default st;
