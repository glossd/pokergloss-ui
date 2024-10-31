import { createMuiTheme }  from '@material-ui/core/styles'

const spiritWorldTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      root: {
        width: '98%',
        padding: '3px 0',
      },
      track: { backgroundColor: 'rgb(170, 133, 92)' },
      rail: { backgroundColor: '#585757' },
      thumb: {
        width: '23px',
        height: '23px',
        marginTop: '-11px',
        marginLeft: '-11px',
        backgroundColor: 'rgb(170, 133, 92)',
      }
    },
    MuiInputBase: {
      inputMarginDense: {
        padding: '2px'
      }
    },
    MuiCheckbox: {
      colorSecondary: {
        color: 'rgb(170, 133, 92)',
        '&$checked': {
          color: 'rgb(170, 133, 92)',
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
        background: 'rgb(170, 133, 92)',
        borderWidth: 0,
        '&:focus': {
          outline: 'none',
        },
        '&:hover': {
          backgroundColor: 'rgb(111,86,62)',
        },
        '&:active': {
          backgroundColor: 'rgb(82,68,46)',
        },
        '&:disabled': {
          color: 'white',
          backgroundColor: 'rgb(50,40,29)',
        },
      }
    },
  },
})

export default spiritWorldTheme