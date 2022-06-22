const styles = (theme) => {
    return {
        input: {
            '& fieldset': {
                borderColor: theme.palette.input.borderColor,
            },
        },
        borderColor: {
            borderColor: theme.palette.divider + ' !important',
        },
    };
};
export default styles;
