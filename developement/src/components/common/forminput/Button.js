import React from 'react';
import {getFormat} from './util/Function';
import classNames from 'classnames';
import InputWrapper from './InputWrapper';

const Button = ({click, ...source}) => {   // eslint-disable-line no-unused-vars
    let rest = typeof(click) === 'function' ? {'onClick': (e) => {
        click(e, source.action, source);
    }} : {};
    let inputStyle = source.inputStyle || 'secondary-btn';

    return <InputWrapper source={source} type="button">
        <button className={inputStyle} {...rest}>
            {source.value || 'kiet'}
        </button>
    </InputWrapper>
};

export default Button;