import React from 'react';
import './DialogBox.scss';

/******************************************************************************
******************************************************************************/
export class DialogBox extends React.Component {
  constructor(props) {
    super(props);
    this._click      = this._click.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  render() {
    const {type, source, title, component} = this.props;

    let wcag = {'role': 'dialog'};
    if ( title ) { wcag['aria-labelledby'] = 'dialog-box-title'; }

    return <div className={'dialog-box-wrapper' + (type ? ' -'+type : '')} ref="dialogBox" tabIndex="0" {...wcag}>
      <div className="dialog-box-frame flex">
        <div className="dialog-box-header flex-header">
          { !! title && <h1 id="dialog-box-title">{title}</h1> }
          <button title="Cancel dialog box" className="icon-btn -small-view -cross -blue dialog-box-close-btn" onClick={(e)=>{this._click(e, 'close')}}>
            <span className="aria-visible">Close dialog box</span>
          </button>
        </div>
        <div className="dialog-box-body flex-body"> 
          { !! component && <div className="component-holder">{component}</div> }
        </div>
      </div>
      <div className="dialogBox-bg-closer" onClick={(e)=>{this._click(e, 'close')}} />
    </div>
  }

  componentDidMount() {
    if ( this.refs.dialogBox ) {
      this.refs.dialogBox.focus();
    }
  }

  /****************************************************************************
  ****************************************************************************/
  closeDialog() {
    this.props.actions.closeDialog();
  }

  /****************************************************************************
  ****************************************************************************/

  _click( e, key, data ) {
    if ( e ) { e.preventDefault(); }

    if ( key === 'close' ) {
      this.closeDialog();
    }
  }
}