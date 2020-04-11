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

  /*
  _initElement( data, pin, formData ) {
    if ( ! data || ! data.id ) { return null; }

    let out = null, key = pin || generateId(), properties = {'source': data, 'formData': formData};
    if ( data.maxLength ) { properties.maxLength = data.maxLength; }
    if ( data.required )  { properties.required = true; }
    if ( data.disabled )  { properties.disabled = true; }
    if ( data.format   )  {
      properties.onKeyUp = this._keyup;
      properties.onFocus = this._focus;
      properties.onBlur  = this._blur;
    }

    if ( data.type === 'textfield' || data.type === 'telfield' || data.type === 'email' || data.type === 'password' ) {
      out = <Field key={key} id={data.id} name={data.name} label={data.label}
        autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off" placeholder={data.placeholder}
        component={Textfield} props={properties}/>
    } else if ( data.type === 'textarea' ) {
      out = <Field key={key} id={data.id} name={data.name} type="text" label={data.label}
        autoComplete="off" spellCheck="false" autoCapitalize="off" autoCorrect="off" placeholder={data.placeholder}
        component={Textarea} props={properties}/>
    } else if ( data.type === 'hidden' ) {
      out = <Field key={key} id={data.id} name={data.name} type="hidden" component="input"/>
    } else if ( data.type === 'selection' && data.selection instanceof Array ) {
      out  = <Field key={key} id={data.id} name={data.name} type="select" label={data.label}
        component={Selection} props={properties}/>
    } else if ( data.type === 'checkbox') {
      out  = <Field key={key} id={data.id} name={data.name} type="checkbox" label={data.label}
        component={Checkbox} props={properties}/>
    } else if ( data.type === 'radioboxes' || data.type === 'radio' ) {
      if ( ! data.labels ) {
        data.labels = [getTranslation('button.accept'), getTranslation('button.notAccept')];
      }
      out  = <Field key={key} id={data.id} name={data.name} component={RadioBoxes} props={properties}/>
    } else if ( data.type === 'leadtext' && data.text) {
      out = <div key={key} className={'lead paragraph bold '+ data.id}>{data.text}</div>
    } else if ( data.type === 'fileuploader') {
      if (this.props.name && this.props.dispatch) {
        properties.onClick  = this._click;
      }
      out = <Field key={key} id={data.id} name={data.name} label={data.label}
        component={Filefield} props={properties}/>
    }
    return out;
  }
  */

    /****************************************************************************
    ****************************************************************************/
    getReference = (key) => {
        return this.refs[key];
    }

    /****************************************************************************
    ****************************************************************************/
    _getContentData(e) {
        if ( ! e ) { return; }

        let target = e.currentTarget, id = target.id, value = target.value || '';
        if ( ! id || ! value) { return; }

        let found = this.props.content.find(d => d.id === id);
        if ( ! found ) { return; }

        return {
            'e'     : e,
            'code'  : e.keyCode,
            'field' : target,
            'name'  : found.name,
            'id'    : id,
            'value' : value,
            'config': found
        };
    }
}

/*
FormContent.propTypes = {
  'dispatch': PropTypes.function.isRequired
};
*/
