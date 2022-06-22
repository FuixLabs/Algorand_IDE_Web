const st = (theme) => {
    return {
        register: {
            fill: theme.palette.register.iconColor + ' !important',
        },
        operation: {
            fill: theme.palette.operation.iconColor + ' !important',
        },
        logoQ: {
            '& .background-logo': {
                fill: theme.palette.text.primary,
            },
            '& .q-logo': {
                fill: theme.palette.background.sidebar,
            },
        },
        fill: {
            fill: theme.palette.text.primary,
        },
    };
};
export default st;
