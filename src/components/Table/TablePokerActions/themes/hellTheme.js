import { createMuiTheme }  from '@material-ui/core/styles'

const hellTheme = createMuiTheme({
  overrides: {
    MuiSlider: {
      root: {
        width: '98%',
        padding: '3px 0',
      },
      track: { backgroundColor: '#ce0005' },
      rail: { backgroundColor: '#585757' },
      thumb: {
        width: '23px',
        height: '23px',
        marginTop: '-11px',
        marginLeft: '-11px',
        backgroundColor: '#ce0005',
      }
    },
    MuiInputBase: {
      inputMarginDense: {
        padding: '2px'
      }
    },
    MuiCheckbox: {
      colorSecondary: {
        color: '#ce0005',
        '&$checked': {
          color: '#ce0005',
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
        background: '#ce0005',
        borderWidth: 0,
        '&:focus': {
          outline: 'none',
        },
        '&:hover': {
          backgroundColor: '#970306',
        },
        '&:active': {
          backgroundColor: '#710106',
        },
        '&:disabled': {
          color: 'white',
          backgroundColor: 'rgb(49,8,9)',
        },
      }
    },
  },
})

export default hellTheme