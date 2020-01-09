import React from 'react';
import './Recognition.scss';

/******************************************************************************
******************************************************************************/
export class Recognition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'id'      : 'recognition-' + new Date().getTime() + '-' + Math.floor(Math.random() * 10000 + 1),
      'error'   : this._verifyRecognition(),
      'language': props.language || 'en-US',
      'textList': []
    };

    this._click = this._click.bind(this);

    this._loadRecognition    = this._loadRecognition.bind(this);
    this._resultRecognition  = this._resultRecognition.bind(this);
    this._endRecognition     = this._endRecognition.bind(this);
    this._nomatchRecognition = this._nomatchRecognition.bind(this);
    this._errorRecognition   = this._errorRecognition.bind(this);
  }

  render() {
    const {id, error, recognition, textList} = this.state;

    return <div className="recognition-wrapper" ref="recognition" role="application">
      <h1>Recognition</h1>
      { error ? <div className="message-wrapper -danger">{error}</div> : 
          <div className="recognition-content">
            <div className="action-holder">
              <button className="secondary-btn -blue -fill" onClick={(e)=>{this._click(e,'start')}}>Start</button>
              <button className="secondary-btn" onClick={(e)=>{this._click(e,'stop')}}>Stop</button>
            </div>

            { !! recognition && <div className="message-wrapper">Say something!</div> }

            { (textList || []).length > 0 && <div className="text-holder">
                <ul className="text-list">
                  { textList.map( (text,i) => {
                    return <li key={'recognition-text-item'+i}>{text}</li>
                  }) }
                </ul>
              </div>
            }

          </div>
      }
    </div>
  }

  //componentWillMount() { this._loadRecognition( true ); }

  /****************************************************************************
  ****************************************************************************/
  _click( e, key ) {
    if ( e ) { e.preventDefault(); }

    if ( key === 'start' ) {
      let recognition = this._loadRecognition( true );
    } else if ( key === 'stop' ) {
      if ( this.state.recognition ) {
        this.state.recognition.stop();
      }
      this.setState({'recognition': null, 'textList': []});
    }
  }

  /****************************************************************************
  ****************************************************************************/
  _verifyRecognition() {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    return SpeechRecognition && SpeechGrammarList ?  '' :
      'The browser does not support recognition.';
  }

  _loadRecognition( start, stateData ) {
    if ( this.state.recognition ) {
      this.state.recognition.stop();
    }

    let error = this._verifyRecognition(), state = {...(stateData || {})};
    if ( error ) {
      state.error = error;
      return this.setState(state);
    }

    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    //let SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

    let recognition = SpeechRecognition ? new SpeechRecognition() : null;
    let grammarList = SpeechGrammarList ? new SpeechGrammarList() : null;
    //let recognitionEvent = SpeechRecognitionEvent ? new SpeechRecognitionEvent() : null;

    //recognition.grammars = grammarList;
    recognition.lang = this.state.language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult    = this._resultRecognition;
    recognition.onspeechend = this._endRecognition;
    recognition.onnomatch   = this._nomatchRecognition;
    recognition.onerror     = this._errorRecognition;

    if ( start ) { recognition.start(); }

    state.recognition = recognition;
    this.setState(state);
  }

  _resultRecognition( e ) {
    //console.log('==> result...');
    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    let list = [text].concat(this.state.textList);
    //this._loadRecognition( true, {'textList': list});
    this.setState({'textList': list});
  }

  _endRecognition() {
    //console.log('==> end...');
  }

  _nomatchRecognition() {
    //console.log('==> no match...');
  }

  _errorRecognition() {
    //console.log('==> error...'); 
    if ( this.state.recognition ) { this.state.recognition.stop(); }
    this.setState({'recognition': null});
  }
}