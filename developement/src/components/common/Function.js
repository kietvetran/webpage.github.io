import { trim, createRegexp, isValid, sortList, capitalize } from './General';

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