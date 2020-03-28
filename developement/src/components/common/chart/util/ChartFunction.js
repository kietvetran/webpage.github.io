import {generateId} from '../../General';

export const getPolarToCartesian = ({x=0, y=0, radius=0, angle=0}) => {
  let angleInRadians = (angle-90) * Math.PI / 180.0;
  return {
    'x': x + (radius * Math.cos(angleInRadians)),
    'y': y + (radius * Math.sin(angleInRadians))
  };
};

export const getCirclePath = ({x=0, y=0, radius=0, startAngle=0, endAngle=0}) => {  
  if ( endAngle >= 360 ) { endAngle = 359.999; }

  let start = getPolarToCartesian({'x':x, 'y':y, 'radius': radius, 'angle':endAngle});
  let end   = getPolarToCartesian({'x':x, 'y':y, 'radius': radius, 'angle':startAngle});
  let arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y, 
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(' ');
};

export const getChartText = ({id='', type='text',x=0,y=0,size='',text='',color='',textAnchor='',baseline='',...rest}) => {
  let prefix = 'chart-'+Math.floor(Math.random() * 100 + 1);
  return {
    'id'  : id || generateId(prefix),
    'type': type,
    'x'   : x,
    'y'   : y,
    'text': text,
    'textAnchor': textAnchor || 'middle',
    'dominantBaseline': baseline || 'middle',
    'style': {
      'fill'       : color || '#444',
      'fontFamily' : 'Arial, Helvetica, sans-serif',
      'fontSize'   : size || '1em'
    },
    ...rest
  };
};

export const createSymbolPath = ({center=[], radius=0, symbol=''}) => {
  if ( isNaN(center[0]) ||  isNaN(center[1]) || ! radius ) { return ''; }

  let pointList = [], note = {
    'top'   : center[1] - radius,
    'bottom': center[1] + radius,
    'left'  : center[0] - radius,
    'right' : center[0] + radius,
  };

  if ( symbol === 'triangle' ) {
    pointList = _getTrianglePointList( center, radius, note );
  } else if ( symbol === 'triangle-down' ) {
    pointList = _getTriangleDownPointList( center, radius, note );
  } else if ( symbol === 'triangle-left' ) {
    pointList = _getTriangleLeftPointList( center, radius, note );
  } else if ( symbol === 'triangle-right' ) {
    pointList = _getTriangleRightPointList( center, radius, note );
  } else if ( symbol === 'square' ) {
    pointList = _getSquarePointList( center, radius, note );
  } else if ( symbol === 'square-single-cross' ) {
    pointList = _getSquareSingleCrossPointList( center, radius, note );
  } else if ( symbol === 'square-double-cross' || symbol === 'square-cross' ) {
    pointList = _getSquareDoubleCrossPointList( center, radius, note );
  } else {
    return getCirclePath({
      'x':center[0], 'y':center[1], 'radius': radius, 'startAngle':0, 'endAngle': 360
    });
  }

  return pointList.length > 1 ? 'M '+ pointList.join(' L ') : '';
};

const _getTrianglePointList = ( center, radius, note ) => {
  return [
    [note.left, note.bottom].join(','),
    [center[0], note.top].join(','),    
    [note.right, note.bottom].join(','),
    [note.left, note.bottom].join(',')
  ];
};

const _getTriangleDownPointList = ( center, radius, note ) => {
  return [
    [note.left, note.top].join(','),
    [center[0], note.bottom].join(','),    
    [note.right, note.top].join(','),
    [note.left, note.top].join(',')
  ];
};

const _getTriangleLeftPointList = ( center, radius, note ) => {
  return [
    [note.left, note.bottom].join(','),
    [note.left, note.top].join(','),    
    [note.right, note.bottom].join(','),
    [note.left, note.bottom].join(',')
  ];
};

const _getTriangleRightPointList = ( center, radius, note ) => {
  return [
    [note.left, note.bottom].join(','),
    [note.right, note.top].join(','),    
    [note.right, note.bottom].join(','),
    [note.left, note.bottom].join(',')
  ];
};

const _getSquarePointList = ( center, radius, note ) => {
  return [
    [note.left, note.bottom].join(','),
    [note.left, note.top].join(','),    
    [note.right, note.top].join(','),
    [note.right, note.bottom].join(','),
    [note.left, note.bottom].join(',')
  ];
};

const _getSquareSingleCrossPointList = ( center, radius, note ) => {
  return [
    [note.left, note.bottom].join(','),
    [note.left, note.top].join(','),    
    [note.right, note.top].join(','),
    [note.right, note.bottom].join(','),
    [note.left, note.bottom].join(','),
    [note.right, note.top].join(',')
  ];
};

const _getSquareDoubleCrossPointList = ( center, radius, note ) => {
  return [
    [note.left, note.bottom].join(','),
    [note.left, note.top].join(','),    
    [note.right, note.top].join(','),
    [note.right, note.bottom].join(','),
    [note.left, note.bottom].join(','),
    [note.right, note.top].join(','),
    [note.left, note.top].join(','),
    [note.right, note.bottom].join(',')
  ];
};