import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    palette: {
        background: {
            default: '#F5F3EE',
            paper: '#F5F3EE',
        },
        primary: {
            main: '#1B2A4A',
        },
        text: {
            primary: '#2B2B2B',
        },
        accent: {
            primary: '#F97316',
            secondary: '#FFFFFF',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    },

                    '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    },

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#F97316',
                    },
                }
            }
        },
        MuiCssBaseline: {
            styleOverrides: {
                notchedOutline: {
                    border: 'none'
                },
                '*': {
                    boxSizing: 'border-box',
                    margin: 0,
                    padding: 0,
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '&:hover': {opacity: 0.7}, transition: '0.1s opacity ease',
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '&:hover': {opacity: 0.7}, transition: '0.1s opacity ease',
                }
            }
        },
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true
            }
        }
    }
});

export default theme;