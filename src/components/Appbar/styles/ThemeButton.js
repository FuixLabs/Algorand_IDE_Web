const st = (theme) => ({
    container: {
        width: 366,
        padding: 20,
        '& .title': {
            fontWeight: 'bold',
            marginBottom: 8,
        },
    },
    listTheme: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        paddingBottom: 8,
        borderRadius: 4,
        position: 'relative',

        '&.disabled': {
            opacity: 0.2,
            cursor: 'not-allowed',
            '&:hover': {
                background: 'unset',
            },
        },
        '&:hover': {
            background: theme.palette.action.hover,
        },
        '&.active': {
            '& .text': {
                color: '#DE8C58',
                border: '1px solid #D38F61',
                borderRadius: 30,
            },
        },
        '& .text': {
            padding: '4px 8px',
        },
    },
    checked: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#DE8C58',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        top: 34,
        '& span': {
            fontSize: 14,
        },
    },
});
export default st;
