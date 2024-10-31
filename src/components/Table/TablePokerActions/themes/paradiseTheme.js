import { createMuiTheme }  from '@material-ui/core/styles'

const paradiseTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      root: {
        width: '98%',
        padding: '3px 0',
      },
      track: {
        backgroundColor: 'rgb(18, 158, 228)',
        opacity: .6,
      },
      rail: {
        backgroundColor: '#979696',
        opacity: .6,
      },
      thumb: {
        width: '23px',
        height: '23px',
        marginTop: '-11px',
        marginLeft: '-11px',
        backgroundColor: 'rgb(18, 158, 228)',
        opacity: .8,
      }
    },
    MuiInputBase: {
      inputMarginDense: {
        padding: '2px'
      }
    },
    MuiCheckbox: {
      colorSecondary: {
        color: 'rgb(18, 158, 228)',
        opacity: .6,
        '&$checked': {
          color: 'rgb(18, 158, 228)',
          opacity: .6,
        }
      },
    },
    MuiButton: {
      root: {
        display: 'inline-block',
        padding: '7px',
        borderRadius: '10px',
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '15px',
        background: 'rgb(18, 158, 228)',
        borderWidth: 0,
        opacity: .6,
        '&:focus': {
          outline: 'none',
        },
        '&:hover': {
          backgroundColor: 'rgb(22, 113, 160)',
        },
        '&:active': {
          backgroundColor: 'rgb(21, 90, 125)',
        },
        '&:disabled': {
          color: 'white',
          backgroundColor: 'rgb(12,52,73)',
        },
      }
    },
  },
})

export default paradiseTheme