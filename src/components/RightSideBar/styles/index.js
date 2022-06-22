const styles = (theme) => {
    return {
        container: {
            background: theme.palette.background.sidebar,
            borderLeft: '1px solid ' + theme.palette.divider,
        },
        select: {
            backgroundColor: theme.palette.background.sidebar + ' !important',
        },
        header: {},
    };
};
export default styles;
