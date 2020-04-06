import { trim, createRegexp, isValid, sortList, capitalize } from './General';
import { Signin } from '../../static/form/signin';

/******************************************************************************
******************************************************************************/
export const getFormTemplate = (key) => {
  let source = {
    'signin'         : Signin
  };
  return source[key] || null;
}

export const generateReduxFormValidation = (template) => {
  return (values) => {
    let errors = template.content.reduce((prev, cnt) => {
      if ( ! cnt ) { return prev; }
      
      (cnt instanceof Array ? cnt : [cnt]).forEach((data) => {
        let { id, name, type, validation } = data;
        if (!id || !name || !type || !(validation instanceof Array)) { return prev; }

        let isBox = type.match(/(checkbox|file|image)/i) ? true : false;
        let value = isBox ? values[name] : trim((values[name] || ''));
        let i = 0, loop = validation.length;
        for (i = 0; i < loop; i++) {
          if (validation[i].ignore) { continue; }

          let error = '';
          if (validation[i].rule === 'required') {
            if (!value) {
              error = validation[i].message || 'Required error';
            }
          } else if (validation[i].rule) {
            if (value && !isValid(value, validation[i].rule, validation[i])) {
              error = validation[i].message || 'Invalid error';
            }
          } else if (validation[i].regex) {
            if (value && value.match(validation[i].regex)) {
              error = validation[i].message || 'Regex error';
            }
          }
          if (error) { prev[name] = error; i = loop; }
        }
      });
      return prev;
    }, {});

    return errors;
  };
}

/******************************************************************************
=== ===
******************************************************************************/
export const getPagingList = ( config ) =>{
  ['total', 'from', 'size'].forEach( (key) => {
    if ( typeof(config[key]) === 'string') {
      config[key] = parseInt(config[key].replace( /\^(\s+|0)/g, '') || '0');
    } else if ( ! config[key] ) {
      config[key] = 0;
    }
  });

  if ( ! config.total || config.total < config.size ) { return []; }

  let index = parseInt((config.from / config.size));
  let mode  = config.total > config.size ? config.total % config.size : 0;
  let loop  = ((parseInt((config.total/config.size)) + (mode ? 1 : 0)) || 2) - 1;
  let list  = [], next = config.next || 2;
  let interval = [index - next - 1, index + next + 1];

  for (let i = 0; i <=loop; i++) {
    let active = i === index, checked = !active && i !== 0 && i !== loop;
    let hide   = checked && (i < interval[0] || i > interval[1]);
    let trancation = checked && (i === interval[0] || i === interval[1]);
    if ( hide ) { continue; }

    list.push({
      'name': (i+1),
      'active': active,
      'trancation': trancation,
      'index': i,
      'from' : (i * config.size),
      'config': config
    });
  }
  return list;
}