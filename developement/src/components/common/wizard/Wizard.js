import React from 'react';
import classNames from 'classnames';
import {generateId} from '../General';
import './Wizard.scss';

export const Step = ({stepId, nextStep, prevStep, isLast, isPrevious, finish, children}) => {
    let style = classNames( 'wizard-content', {
        '-next': ! isPrevious,
        '-previous': isPrevious 
    });

    return <section className={style} role="tabpanel" aria-labelledby={stepId}>
        <div className="step-body">
            {children}
        </div>
        <div className="step-footer">
            <div className="left-side">
                <button className="secondary-btn" onClick={prevStep}>Previous</button>
            </div>
            <div className="right-side">
                { isLast ? <button className="primary-btn" onClick={finish}>Finish</button> :
                    <button className="secondary-btn -blue" onClick={nextStep}>Next</button>
                }
            </div>
        </div>
    </section>;
};

export const Header = ({index, steps, click}) => {
    return (steps || []).length ? <ul className="wizard-header" role="tablist">
        { steps.map( (data,i) => {
            let active = i === index;
            return <li id={data.id} key={'header-'+i} role="tab"
                className={classNames('header-item', {'-active': active, '-disabled': data.disabled})}
                aria-disabled={data.disabled} aria-selected={active}
            >
                <a hrref="#" className="header-btn" aria-controls={data.id}
                    onClick={(e)=>{click(e,'change-step',data)}}
                >
                    <span aria-hidden="true" className="number"><b>{i+1}</b></span>
                    { !! data.title && <span className="title">{data.title}</span> }
                </a>
            </li>
        }) }
    </ul> : null;
};

export default class Wizard extends React.Component {
    static Step = (props) => <Step {...props}/>;

    state = {
        ...this._initState( this.props )
    };

    render() {        
        const {children} = this.props;
        const {index, display, steps, headerSide} = this.state; 
        const length = (children || []).length;

        return length ? <div className={classNames('wizard-wrapper', '-count-'+length, '-'+headerSide)} role="application">
            <Header {...this.props} {...this.state} click={this._click}/>

            { React.Children.map( children, (element, i) => {
                return index === i ? React.cloneElement( element, {
                    'stepId'    : steps[i].id,
                    'isPrevious': display === 'previous',
                    'isLast'    : (index === (children.length - 1)),
                    'nextStep'  : this._nextStep,
                    'prevStep'  : this._prevStep,
                    'finish'    : this._finish
                }) : null;
            }) }
        </div> : null
    }

    /****************************************************************************
    ****************************************************************************/
    _click = (e, key, data) => {
        if ( e && e.preventDefault ) { e.preventDefault(); }
        if ( key === 'change-step' ) {
            this._navigate( data.index );
        }
    }

    /****************************************************************************
    ****************************************************************************/
    _nextStep = () => {
        this._navigate(null, 'next');
    }

    _prevStep = () => {
        this._navigate(null, 'previous');
    }

    _navigate = ( i, display ) => {
        let {index, steps, type} = this.state, length = steps.length;
        if ( ! length ) { return; }

        let {navigate} = this.props, fromStepEvent = display && i === null;

        if ( isNaN(i) || (!i && i !== 0) ) {
            if ( display !== 'next' && display !== 'previous'     ) { return; }
            if ( display === 'next'     && index === (length - 1) ) { return; }
            if ( display === 'previous' && index === 0            ) { return; }
            i = index + (display === 'next' ? 1 : -1);
        }

        if ( i < 0 || i >= length || i === index ) { return; }

        if ( ! display ) { display = i > index ? 'next' : 'previous'; }

        let state = {'index': i, 'display': display, 'steps': steps };

        if ( typeof(navigate) === 'function' && navigate({...state, 'current': index}) === false ) {
            return;
        } else if ( type === 'step-by-step' && ! fromStepEvent && state.steps[i].disabled ) {
            return;
        }

        state.steps[i].disabled = false;
        this.setState( state );
    }

    _finish = () => {
        if ( typeof(this.props.finish) === 'function' ) {
            this.props.finish();
        }
    }

    /****************************************************************************
    ****************************************************************************/
    _initState( props ) {
        let {children, type, index, headerSide} = props, state = {
            'index' : isNaN(index) ? 0 : index,
            'type'  : type  || 'step-by-step',
            'steps' : [],
            'headerSide': headerSide === 'left' ? 'header-left' : 'header-top',
        };

        for ( let i=0; i<(children || []).length; i++ ) {
            state.steps.push({
                'id'      : generateId('wizard'),
                'step'    : (i+1)+'',
                'index'   : i,
                'title'   : ((children[i] || {}).props || {}).title || '',
                'element' : children[i],
                'disabled': type === 'tab' ? false : (state.index < i)
            });
        }

        return state;
    }
};