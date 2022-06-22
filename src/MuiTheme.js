import { createTheme } from '@mui/material/styles';
import _colorSetting from './themes/projectPageColor_dark.json';
function MuiTheme(colorSetting = _colorSetting) {
    const theme = createTheme({
        palette: {
            mode: colorSetting.type,
            primary: Object.assign({}, colorSetting.primary),
            secondary: Object.assign({}, colorSetting.secondary), //color of button.
            error: Object.assign({}, colorSetting.error),
            text: Object.assign({}, colorSetting.text),
            info: Object.assign({}, colorSetting.info),
            success: Object.assign({}, colorSetting.success),
            warning: Object.assign({}, colorSetting.warning),
            action: Object.assign({}, colorSetting.action),
            divider: colorSetting.divider,
            background: Object.assign({}, colorSetting.background),
            sidebar: Object.assign({}, colorSetting.sidebar),
            dropdownMenu: Object.assign({}, colorSetting.dropdownMenu),
            dialog: Object.assign({}, colorSetting.dialog),
            table: Object.assign({}, colorSetting.table),
            iconColor: Object.assign({}, colorSetting.iconColor),
            input: Object.assign({}, colorSetting.input),
            dashboard: Object.assign({}, colorSetting.dashboard),
            login: Object.assign({}, colorSetting.login),
            designPage: Object.assign({}, colorSetting.designPage),
            tab: Object.assign({}, colorSetting.tab),
            dapp: Object.assign({}, colorSetting.dapp),
            register: Object.assign({}, colorSetting.register),
            operation: Object.assign({}, colorSetting.operation),
            port: Object.assign({}, colorSetting.port),
            contrast: colorSetting.contrast,
        },
        components: {
            MuiTableCell: {
                styleOverrides: {
                    head: {
                        fontSize: 14,
                        whiteSpace: 'nowrap',
                        fontWeight: 'bold',
                        backgroundColor: colorSetting.table.backgroundHeader,
                        color: colorSetting.text.secondary,
                        padding: '14px 24px',
                    },
                    body: {
                        fontSize: 14,
                        whiteSpace: 'nowrap',
                        color: colorSetting.text.secondary,
                        padding: '8px 0 8px 24px',
                    },
                    root: {
                        borderBottom: '1px solid ' + colorSetting.divider,
                    },
                },
            },
            MuiTablePagination: {
                styleOverrides: {
                    select: {
                        paddingBottom: 0,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textAlign: 'left',
                    },
                    wrapper: {
                        display: 'flex',
                        flexDirection: 'row',
                    },
                    labelContainer: {
                        padding: '6px !important',
                    },
                },
            },
            MuiExpansionPanel: {
                styleOverrides: {
                    root: {
                        '&:before': {
                            backgroundColor: 'unset',
                        },
                        backgroundColor: colorSetting.input.backgroundColor,
                    },
                },
            },
            MuiExpansionPanelSummary: {
                styleOverrides: {
                    root: {
                        borderBottom: '1px solid ' + colorSetting.divider,
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: colorSetting.background.toolbar,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: colorSetting.background.sidebar,
                    },
                },
            },

            MuiTypography: {
                styleOverrides: {
                    root: {
                        color: colorSetting.text.primary,
                    },
                    body1: {
                        fontSize: '0.875rem',
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        backgroundColor: colorSetting.dropdownMenu.backgroundColorContent,
                        borderColor: colorSetting.divider,
                        borderWidth: 1,
                        borderStyle: 'solid',
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        backgroundColor: colorSetting.dropdownMenu.backgroundColor,
                        marginTop: 1,
                        marginBottom: 1,
                        fontSize: 16,
                    },
                },
            },
            MuiList: {
                styleOverrides: {
                    root: {
                        padding: '0!important',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize',
                    },
                    outlinedSecondary: {
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: colorSetting.text.primary,
                    },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: colorSetting.dialog.backgroundColor,
                    },
                },
            },
            MuiDialogTitle: {
                styleOverrides: {
                    root: {
                        backgroundColor: colorSetting.dialog.backgroundColor,
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    select: {
                        color: colorSetting.text.primary,
                    },
                },
            },
            MuiSwitch: {
                styleOverrides: {
                    track: {
                        backgroundColor: colorSetting.text.primary,
                    },
                },
            },
            MuiPrivateTextarea: {
                styleOverrides: {
                    textarea: {
                        overflowY: 'hidden',
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: colorSetting.input.backgroundColor,
                        borderRadius: '4px',
                        minHeight: 40,
                    },
                    input: {
                        // padding: '11.5px 14px',
                        '&:-webkit-autofill': {
                            webkitBoxShadow: `0 0 0 30px ${colorSetting.input.backgroundColor} inset !important`,
                            webkitTextFillColor: colorSetting.text.primary,
                            caretColor: colorSetting.text.primary,
                        },
                    },
                },
            },
            MuiInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: colorSetting.input.backgroundColor,
                        borderRadius: '0px',
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    input: {
                        fontSize: 14,
                    },
                    inputMultiline: {
                        '&::placeholder': {
                            fontSize: 12,
                        },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        zIndex: 2,
                        color: colorSetting.text.secondary,
                        fontSize: 14,
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        backgroundColor: colorSetting.primary.main,
                        color: colorSetting.primary.contrastText,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    },
                    popper: {
                        opacity: 1,
                    },
                },
            },
            MuiFormHelperText: {
                styleOverrides: {
                    root: {
                        marginLeft: 0,
                    },
                },
            },
        },
        typography: {
            fontFamily: 'Public Sans',
            useNextVariants: true,
            fontSize: 14,
        },
        mixins: {
            toolbar: {
                minHeight: 86,
            },
        },
    });
    return theme;
}

export default MuiTheme;
