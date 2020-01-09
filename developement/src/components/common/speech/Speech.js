import React from 'react';

import './Speech.scss';

/******************************************************************************
******************************************************************************/
export class Speech extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'id'       : 'speech-' + new Date().getTime() + '-' + Math.floor(Math.random() * 10000 + 1),
      'textLabel': props.textLabel     || 'Text',
      'languageLabel': props.languageLabel || 'Language',
    };

    this._click      = this._click.bind(this);
    this._submit     = this._submit.bind(this);
    this._speak      = this._speak.bind(this);
    this._loadVoices = this._loadVoices.bind(this);
  }

  render() {
    const {id, languageList, languageLabel, textLabel, error} = this.state;

    return <div className="speech-wrapper" ref="speech" role="application">
      <h1>Speech</h1>
      { !! error && <div className="message-wrapper -danger">{error}</div> }

      { (languageList || []).length > 0 && <div className="speech-content">
        <form name="speakfForm" ref="speakfForm" noValidate onSubmit={this._submit} className="form-wrapper">
            <div className="input-content">
              <label htmlFor={id+'-input-value'} className="input-label">{textLabel}</label>
              <textarea name="text" id={id+'-input-value'} className="textarea" required={true}></textarea>
            </div>
            <div className="input-content">
              <label htmlFor={id+'-language'} className="input-label">{languageLabel}</label>
              <select className="select-box" id={id+'-language'} name="language">
                {languageList.map((data,i) => {
                    return data.id ? <option key={'language-'+i} value={data.id}>{data.name || data.id}</option> : null
                }) }
              </select>
            </div>
            <div className="action-holder">
              <button type="submit" className="primary-btn">Speak</button>
            </div>
          </form>
        </div>
      }
    </div>
  }

  componentWillMount() {
    window.speechSynthesis.onvoiceschanged = (e) => {
      this._loadVoices();
    };
  }

  componentDidMount() {
    this._loadVoices();
  }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }
  }

  _submit( e ) {
    if ( e ) { e.preventDefault(); }
    let formData = this._getFormData( this.refs.speakfForm );  
    this._speak( formData );
  }

  /****************************************************************************
  ****************************************************************************/
  _speak( config) {
    if ( ! config || ! config.text ) { return; }

    // Create a new instance of SpeechSynthesisUtterance.
    let msg = new SpeechSynthesisUtterance();

    // Set the attributes.
    ['text','volume','rate','pitch'].forEach((key) => {
      if ( ! config[key] ) { return; }
      msg[key] = key === 'text' ? config[key] : parseFloat((config[key]+''));
    });
    
    if ( config.language ) {
      let list  = this.state.voiceList || [];
      let voice = list.find((d)=> d.lang === config.language );
      if ( voice ) { msg.voice = voice; }
    }
    
    window.speechSynthesis.speak(msg);
  }

  _loadVoices() {
    if ( ! ('speechSynthesis' in window) )  {
      return this.setState({'error': 'The browser does not support speech synthesis.'});
    }

    let languageList = window.speechSynthesis.getVoices(), list = [], top = [];
    languageList.forEach((d) => {
      let data = {'id':d.lang, 'name': (d.name + ' ('+d.lang+')').replace( /^google\s+/i, '') };
      if ( /zh-hk/i.test(data.id) ) {
        top.push( data );
      } else { list.push(data); }
    });
    
    list = top.concat( list );
    this.setState({'languageList': list, 'voiceList': languageList});
  }

  /****************************************************************************
  ****************************************************************************/
  _getFormData(form, includeUncheck, unTrim) {
    let data = {}, selector = 'input, select, textarea, checkbox';
    let elements = form ? form.querySelectorAll(selector) : [];

    for (let i = 0; i < elements.length; ++i) {
      let element = elements[i], type = element.type, name = element.name;
      let value = unTrim ? element.value : this._trim(element.value, true);

      if (type.match(/radio|checkbox/i) && name) {
        if (element.checked) {
          if (data[name]) {
            if (!(data[name] instanceof Array)) {
              data[name] = [data[name]];
            }
            data[name].push(value || 1);
          } else {
            data[name] = value || 1;
          }
        } else if (includeUncheck || type.match(/checkbox/i)) {
          if (data[name]) {
            if (!(data[name] instanceof Array)) {
              data[name] = [data[name]];
            }
            data[name].push(0);
          } else {
            data[name] = 0;
          }
        }
      } else if (name) {
        if (data[name]) {
          if (!(data[name] instanceof Array)) {
            data[name] = [data[name]];
          }
          data[name].push(value);
        } else {
          data[name] = value;
        }
      }
    }
    return data;    
  }

  _trim (text, multipleWhiteSpace){
    let out = ((text || '') + '').replace(/^\s+/, '').replace(/\s+$/g, '');
    return multipleWhiteSpace ? out.replace(/\s+/g, " ") : out;
  }
}