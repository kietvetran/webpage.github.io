import React from 'react';
import classNames from 'classnames';

const InputWrapper = ({children, fieldId, isInvalid, type, meta, source, ...custom}) => {   // eslint-disable-line no-unused-vars
    if ( ! children ) { return null; }

    let wrapperStyle = classNames('input-content', ('-'+type), (source.wrapperStyle || ''), {
        '-required': custom.required || false,
        '-invalid' : isInvalid,
    });

    let labelStyle = classNames('input-label', {'-required' : custom.required || false});

    return <div role="region" className={wrapperStyle}>
        {!! custom.label && <label htmlFor={fieldId} className={labelStyle}>
                <span>{ custom.label }</span>
                {!!source.labelNote && <span className="input-label-note"> {source.labelNote}</span>}
            </label>
        }

        {!! source.description &&
            <div id={fieldId + '-description'} className="input-label-description"
                dangerouslySetInnerHTML={{'__html': source.description}}
            />
        }

        { children }

        { isInvalid &&
            <div id={fieldId + '-error'} className="input-error-message" aria-live="polite">
                {meta.error || meta.warning}
            </div>
        }
	</div>
};

export default InputWrapper;