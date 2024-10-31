import { createMuiTheme }  from '@material-ui/core/styles'

const defaultTheme = createMuiTheme({
  overrides: {
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
    MuiInputBase: {
      inputMarginDense: {
        padding: '2px'
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
    MuiButton: {
      root: {
        display: 'inline-block',
        padding: '7px',
        borderRadius: '10px',
        color: 'white',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '15px',
        background: 'rgb(16, 134, 26)',
        borderWidth: 0,
        '&:focus': {
          outline: 'none',
        },
        '&:hover': {
          backgroundColor: 'rgba(14, 189, 28, 0.5)',
        },
        '&:active': {
          backgroundColor: 'rgba(20, 106, 21, 0.5)',
        },
        '&:disabled': {
          color: 'white',
          backgroundColor: '#172b37',
        },
      }
    }
  },
})

export default defaultTheme