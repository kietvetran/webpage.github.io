import React from "react";
import { Field } from "redux-form";
import Textfield from "./Textfield";
import Textarea from "./Textarea";
import SelectBox from "./SelectBox";
import Checkbox from "./Checkbox";
import RadioBoxes from "./RadioBoxes";
import { generateId } from "../General";
import classNames from 'classnames';

export class FormContent extends React.Component {

    render() {
        let { content, type, formData } = this.props;
        let list = content instanceof Array ? content : [content];

        let elements = list.map((cnt, i) => {
            if ( ! cnt ) { return null; }

            let pin = 'form-element-' + i;
            if ( ! (cnt instanceof Array) ) {
                if ( ! cnt.id ) { cnt.id = generateId(); }
                return this._initElement(cnt, pin, formData);
            }

            let collection = [], out = cnt.map((data, j) => {
                if ( ! data ) { return null; }

                data.id = data.id || generateId();

                if (data.name || data.id ) {
                    collection.push(data.name || data.id);

                    if (data.formCntStyle) {
                      collection.push(data.formCntStyle);
                    }
                }
                return this._initElement(data, (pin+'-'+j), formData);
            }).filter(d => !!d);

            let style = classNames(
              'form-cnt-wrapper',
              (collection.length ? ' -'+collection.join(' -') : '')
            );

            return out.length ?
              <div key={pin} className={style}>{out}</div> : null;
        }).filter(data => !!data);

        return <div className={classNames('form-content', (type ? '-'+type : ''))}>
            {elements}
        </div>
    }

    _initElement(data, pin, formData) {
        if ( ! data || ! data.id || ! data.type ) { return null; }

        let out = null, key = pin || generateId(), custom = {
            ...data, 'fieldName': data.name || ''
        };

        let properties = {
            'source'  : data,
            'formData': formData,
            'actions' : this.props.actions,
            'formName': this.props.name
        };

        ['required', 'disabled', 'checked', 'maxLength'].forEach( (key) => {
            if ( ! data[key] ) { return; }
            properties[key] = isNaN(data[key]) ? true : data[key];
        });

        let validation = (data.validation || [])[0] || {};
        if ( validation.rule === 'required' && validation.dependent ) {
            this._verifyDependent( properties, validation.dependent );
        }

        if ( data.type.match( /^(textfield|telfield|email|password)$/i) ) {
            out = <Field key={key} id={data.id} name={data.name} label={data.label}
                autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off"
                placeholder={data.placeholder} component={Textfield} props={properties}
            />;
        } else if (data.type === 'textarea' ) {
            out = <Field key={key} id={data.id} name={data.name} type="text" label={data.label}
                autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off"
                placeholder={data.placeholder} component={Textarea} props={properties}
            />
        } else if (data.type === 'hidden') {
            out = <Field key={key} id={data.id} name={data.name} type="hidden" component="input"/>
        } else if (data.type === 'select') {
            out = <Field key={key} id={data.id} name={data.name} type="select" label={data.label}
                component={SelectBox} props={properties}
            />
        } else if (data.type === 'checkbox') {
            out = <Field key={key} id={data.id} name={data.name} type="checkbox"
                {...custom} component={Checkbox} props={properties}
            />
        } else if (data.type === 'radio') {
            out = <Field key={key} id={data.id} name={data.name}
                component={RadioBoxes} props={properties}
            />
        } else if (data.type === 'time-interval') {
            out = <TimeInterval key={key} {...data} properties={properties} />;
        } else if (data.type === 'stop-and-line') {
            if ((formData || {}).suggestion) {
                data.suggestion = formData.suggestion;
            }
            out = <StopAndLine ref="stopAndLine" key={key} {...data} {...custom}
                {...this.props} properties={properties}
            />
        }
        return out;
    }

    /****************************************************************************
    ****************************************************************************/
    getReference = (key) => {
        return this.refs[key];
    }

    /****************************************************************************
    ****************************************************************************/
    _verifyDependent( properties=[], dependent=[] ) {
        let {values={}} = this.props, depending = (dependent || []).find( (k) => {
            let d = typeof(k) === 'string' ? {'key': k} : k;
            return values[d.key] || typeof(values[d.key]) === 'number';
        });
        properties.required = depending ? true : false;
    }
}

/*
FormContent.propTypes = {
  'dispatch': PropTypes.function.isRequired
};
*/
