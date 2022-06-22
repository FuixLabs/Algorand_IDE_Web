const styles = (theme) => {
    return {
        container: {
            background: theme.palette.background.sidebar,
            borderRight: '1px solid ' + theme.palette.divider,
        },
        header: {
            borderColor: theme.palette.divider + ' !important',
        },
        infoIcon: {
            '&:hover': {
                color: theme.palette.primary.main,
            },
        },
        link: {
            color: theme.palette.primary.main,
        },
        register: {
            border: '1px solid ' + theme.palette.register.borderColor,
            backgroundColor: theme.palette.register.backgroundColor,
            '&:hover': {
                backgroundColor: theme.palette.register.hoverBackgroundColor,
            },
        },
        operation: {
            border: '1px solid ' + theme.palette.operation.borderColor,
            backgroundColor: theme.palette.operation.backgroundColor,
            '&:hover': {
                backgroundColor: theme.palette.operation.hoverBackgroundColor,
            },
        },
        registerText: {
            color: theme.palette.register.iconColor + ' !important',
        },
        operationText: {
            color: theme.palette.operation.iconColor + ' !important',
        },
    };
};
export default styles;
