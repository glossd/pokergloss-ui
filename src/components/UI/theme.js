import { createMuiTheme }  from '@material-ui/core/styles'

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
      root: {
        padding: '1vw'
      }
    },
    MuiSlider: {
      root: {
        width: '98%',
        padding: '3px 0',
      },
      track: { backgroundColor: '#37800c' },
      rail: { backgroundColor: '#585757' },
      thumb: {
        width: '23px',
        height: '23px',
        marginTop: '-11px',
        marginLeft: '-11px',
        backgroundColor: '#37800c',
      }
    },
    MuiFormControlLabel: {
      root: {
        marginBottom: 0,
        marginRight: 0,
      }
    },
    MuiFormControl: {
      root: {
        justifyContent: 'center',
        width: '100%',
      }
    },
    MuiSnackbar: {
      anchorOriginTopRight: {
        top: '65px !important'
      }
    },
    MuiList: {
      padding: {
        paddingTop: '0',
        paddingBottom: '0',
      }
    },
    MuiPopover: {
      paper: {
        background: '#172b37'
      }
    },
    MuiLinearProgress: {
      barColorPrimary: {
        backgroundColor: '#05ab05',
      },
      colorPrimary: {
        backgroundColor: '#cecece',
      },
    },
    MuiBadge: {
      colorPrimary: {
        backgroundColor: '#05ab05',
      }
    },
    MuiCheckbox: {
      colorSecondary: {
        color: '#07ab04',
        '&$checked': {
          color: '#07ab04',
        }
      },
    },
    MuiTabs: {
      indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#1f3d54',
        height: '3px',
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        fontWeight: 'normal',
        fontSize: '17px',
        marginRight: '5px',
        backgroundColor: "#0a161e",
        fontFamily: 'Lobster, Georgia, Times, serif',
        '&:hover': {
          color: '#fff',
          opacity: 1,
          backgroundColor: 'rgb(77 132 165 / 50%)',
        },
        "&$selected": {
          color: "#fff",
          background: "#4d84a5",
        },
      },
      textColorInherit: {
        color: 'rgb(77 132 165)',
      }
    },
    MuiPaginationItem: {
      root: {
        color: "white"
      }
    }
  },
})

export default theme