export const iconSize = {
  'width': 40,
  'height': 40
};

export const colorStorage = {
  'brand'    : '#d2a241',
  'primary'  : '#76a300',
  'secondary': '#0075D2',
  'appFont'  : '#2D2D2D',
  'appBg'    : '#eee',
  'headerBg' : '#FFFFFF',
  'footerBg' : '#FFFFFF',
  'border'   : 'rgba(0, 0, 0, .2)',
  'succes'   : '#76a300',
  'error'    : 'rgba(217, 30, 24, .6)',
  'errorBg'  : 'rgba(217, 30, 24, .2)',
  'warning'  : 'rgba(247, 202, 24, 1)',
  'warningBg': 'rgba(247, 202, 24, .3)',
  'info'     : 'rgba(25, 181, 254, 1)',
  'infoBg'   : 'rgba(25, 181, 254, .2)',
  'link'     : '#2e78b7',
  'focus'    : '#0075D2'
};

export const Theme = {
  'color': {
    ...colorStorage 
  },
  'border': {
    'basic': {
      'borderWidth': 2,
      'borderStyle': 'solid',
      'borderColor': colorStorage.border,
      'borderRadius': 2
    }
  },
  'font': {
    'basic': {
      'fontSize': 17,
      'lineHeight': 24
    },
    'small': {
      'fontSize': 14,
      'lineHeight': 19,
      'fontWeight': 'bold'
    },
    'h1': {
      'fontSize': 30,
      'lineHeight': 35,
      'fontWeight': 'bold'
    },
    'h2': {
      'fontSize': 25,
      'lineHeight': 30,
      'fontWeight': 'bold'
    },
    'h3': {
      'fontSize': 20,
      'lineHeight': 25,
      'fontWeight': 'bold'
    },
    'h4': {
      'fontSize': 17,
      'lineHeight': 25,
      'fontWeight': 'bold'
    },
    'family': 'Cochin'
  },
  'space': {
    'small': 5,
    'medium': 10,
    'large': 15,
    'header': iconSize.height,
    'headerGap': 5,
  },
  'shadow': {
    'level1': {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
    },
    'level2': {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,
      elevation: 10,
    },
    'level3': {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 9,
      },
      shadowOpacity: 0.50,
      shadowRadius: 12.35,
      elevation: 19,
    },
  },
  'button': {
    'backgroundColor': '#0075D2',
    'borderStyle': 'solid',
    'borderColor': '#ccc',
    'borderWidth': 1,
    'borderRadius': 2,
    'color': '#fff',
    'fontWeight': 'normal',
    'overflow': 'hidden',
    'padding': 8,
    'textAlign':'center'
  },
  'inputLabel': {
    'height': iconSize.height,
    'lineHeight': iconSize.height,
    'fontWeight': '500',
    'paddingLeft': 5,
    'paddingRight': 10,
    'opacity': .7
  },
  'inputText': {
    'height': iconSize.height,
    'paddingLeft': 5,
    'paddingRight': 5,
    'borderWidth': 1,
    'borderColor': colorStorage.border
  },
  'inputError': {
    'borderColor': colorStorage.error,
    'backgroundColor': colorStorage.errorBg
  },
  'buttonIcon': {
    ...iconSize,
    'padding': 8
  },
  'invisibleText': {
    'position': 'absolute',
    'left': 0,
    'top': 0,
    'zIndex': -1,
    'fontSize': 1,
    'color': 'transparent'
  },
  'debug': {    
    'borderWidth': 1,
    'borderColor': 'red',
    'borderStyle': 'solid',
  }
};