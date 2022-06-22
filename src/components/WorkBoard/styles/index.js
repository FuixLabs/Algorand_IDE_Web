const styles = (theme) => {
    return {
        wrapper: {
            background: theme.palette.designPage.background,
            '& .react-flow__edge': {
                '&.selected': {
                    '& .react-flow__edge-path': {
                        stroke: theme.palette.primary.main,
                    },
                    '& rect': {
                        fill: theme.palette.primary.main,
                    },
                    '& text': {
                        fill: theme.palette.primary.contrastText,
                    },
                },
                '& rect': {
                    fill: theme.palette.contrast,
                },
            },
            '& .react-flow__background': {
                '& path': {
                    strokeDasharray: '5, 5',
                    stroke: theme.palette.text.primary,
                },
            },
        },
        portIn: {
            background: theme.palette.primary.main,
        },
        connection: {
            '&.error': {
                '& .react-flow__edge-path': {
                    stroke: theme.palette.error.main,
                },
                '& .react-flow__edge-text': {
                    fill: theme.palette.error.contrastText,
                },
                '& .react-flow__edge-textbg': {
                    fill: theme.palette.error.main,
                },
            },
        },
        block: {
            background: theme.palette.designPage.background + ' !important',
            padding: '0px !important',
            '&.register': {
                border: '1px solid ' + theme.palette.register.borderColor,
                '& .block': {
                    backgroundColor: theme.palette.register.backgroundColor,
                },
            },
            '&.operation': {
                border: '1px solid ' + theme.palette.operation.borderColor,
                '& .block': {
                    backgroundColor: theme.palette.operation.backgroundColor,
                },
            },
            '& .port-in': {
                backgroundColor: theme.palette.port.in + ' !important',
                color: theme.palette.port.color,
            },
            '& .port-out': {
                backgroundColor: theme.palette.port.out + ' !important',
                color: theme.palette.port.color,
            },
            '&.error': {
                border: '2px solid ' + theme.palette.error.main,
                backgroundColor: theme.palette.error.light,
            },
            '&.selected': {
                '&.register': {
                    '& .block': {
                        backgroundColor: theme.palette.register.hoverBackgroundColor,
                    },
                },
                '&.operation': {
                    '& .block': {
                        backgroundColor: theme.palette.operation.hoverBackgroundColor,
                    },
                },
            },
        },

        controls: {
            border: '1px solid ' + theme.palette.divider,
            '& button': {
                background: theme.palette.background.sidebar,
                borderColor: theme.palette.divider,
                width: 40,
                height: 32,
                '&:hover': {
                    background: theme.palette.background.sidebar,
                    opacity: 0.7,
                },
                '& svg': {
                    fill: theme.palette.text.primary,
                    maxWidth: 14,
                    maxHeight: 14,
                },
                '&.button-clear': {
                    border: '1px solid ' + theme.palette.divider,
                    '& svg': {
                        fill: theme.palette.error.main,
                        fontSize: 20,
                        maxWidth: 20,
                        maxHeight: 20,
                    },
                },
            },
        },
    };
};
export default styles;
