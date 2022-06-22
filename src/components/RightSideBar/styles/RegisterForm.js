const styles = (theme) => {
    return {
        select: {
            backgroundColor: theme.palette.background.sidebar + ' !important',
        },
        borderInput: {
            '& fieldset': {
                borderColor: theme.palette.input.borderColor,
            },
        },
        borderColor: {
            borderColor: theme.palette.divider + ' !important',
        },
        buttonAdd: {
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            textTransform: 'initial',
            '& svg': {
                marginRight: 7,
                width: 20,
                height: 20,
            },
        },
        modal: {
            background: theme.palette.dialog.backgroundColor,
        },
        svg: {
            color: theme.palette.text.primary,
            width: 20,
            height: 20,
        },
        tableHead: {
            backgroundColor: theme.palette.table.backgroundHeader,
        },
        tableBody: {
            '& tr': {
                '&:hover': {
                    background: theme.palette.action.hover,
                },
            },
        },
        icon: {
            border: '2px solid ' + theme.palette.text.primary,
        },
    };
};
export default styles;
