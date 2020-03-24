import {Animated} from 'react-native';
import {generateId} from  '../../../util/Function';

export const getCirclePath = (x, y, radius, startAngle, endAngle) => {  
  let polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    let angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
      'x': centerX + (radius * Math.cos(angleInRadians)),
      'y': centerY + (radius * Math.sin(angleInRadians))
    };
  };

  let start = polarToCartesian(x, y, radius, endAngle);
  let end   = polarToCartesian(x, y, radius, startAngle);
  let arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y, 
    'A', radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(' ');
};

export const createSymbolPath = ( config={} ) => {
  let center = config.center || [], radius = config.radius || 0;
  if ( isNaN(center[0]) ||  isNaN(center[1]) || ! radius ) { return ''; }

  let pointList = [], note = {
    'top'   : center[1] - radius,
    'bottom': center[1] + radius,
    'left'  : center[0] - radius,
    'right' : center[0] + radius,
  };

  if ( config.symbol === 'triangle' ) {
    pointList = _getTrianglePointList( center, radius, note );
  } else if ( config.symbol === 'triangle-down' ) {
    pointList = _getTriangleDownPointList( center, radius, note );
  } else if ( config.symbol === 'triangle-left' ) {
    pointList = _getTriangleLeftPointList( center, radius, note );
  } else if ( config.symbol === 'triangle-right' ) {
    pointList = _getTriangleRightPointList( center, radius, note );
  } else if ( config.symbol === 'square' ) {
    pointList = _getSquarePointList( center, radius, note );
  } else if ( config.symbol === 'square-single-cross' ) {
    pointList = _getSquareSingleCrossPointList( center, radius, note );
  } else if ( config.symbol === 'square-double-cross' || config.symbol === 'square-cross' ) {
    pointList = _getSquareDoubleCrossPointList( center, radius, note );
  } else {
    return getCirclePath(center[0], center[1], radius, 0, 359.999);
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