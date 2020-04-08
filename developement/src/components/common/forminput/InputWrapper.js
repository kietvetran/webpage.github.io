import React from 'react';
import classNames from 'classnames';


const InputWrapper = ({children, fieldId, isInvalid, type, meta, source, legend, ...custom}) => {   // eslint-disable-line no-unused-vars
    if ( ! children ) { return null; }

    let wrapperStyle = classNames('input-wrapper', ('-'+type), (source.wrapperStyle || ''), {
        '-required': custom.required || false,
        '-invalid' : isInvalid,
    });

    let labelStyle = classNames('input-label', {'-required' : custom.required || false});

    const content = <React.Fragment>
        {!! source.description &&
            <div id={fieldId + '-description'} className="input-label-description"
                dangerouslySetInnerHTML={{'__html': source.description}}
            />
        }

        { children }
    </React.Fragment>;

    return <div role="region" className={wrapperStyle}>
        { legend === undefined ? <React.Fragment>
                {!! custom.label && <label htmlFor={fieldId} className={labelStyle}>
                        <span>{ custom.label }</span>
                        {!!source.labelNote && <span className="input-label-note"> {source.labelNote}</span>}
                    </label>
                }

                {content}
            </React.Fragment> : <fieldset>
                {!! legend && <legend className={'input-label'+ (custom.required ? ' -required' : '')}>
                        <span>{ legend }</span>
                        {!!source.legendNote && <span className="input-label-note"> {source.legendNote}</span>}
                    </legend>
                }

                { content }
            </fieldset>
        }

        { isInvalid &&
            <div id={fieldId + '-error'} className="input-error-message" aria-live="polite">
                {meta.error || meta.warning}
            </div>
        }
	</div>
};

export default InputWrapper;