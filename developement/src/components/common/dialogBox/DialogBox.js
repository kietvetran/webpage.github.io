import React from 'react';
import { Message } from '../../common/util/message/Message';
import './DialogBox.scss';

/******************************************************************************
******************************************************************************/
export class DialogBox extends React.Component {
  constructor(props) {
    super(props);
    this._click     = this._click.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  render() {
    const {type, source, title} = this.props;
    return <div className={'dialog-box-wrapper -' + type} ref="dialogBox">
      <div className="dialog-box-frame flex">
        <div className="dialog-box-header flex-header">
          <button className="icon-btn -cross -blue dialog-box-close-btn" onClick={(e)=>{this._click(e, 'close')}} />
          { !! title && <div className="h2">{title}</div> }
        </div>
        <div className="dialog-box-body flex-body">        
          { type === 'message' && source && <Message {...source}/> }
        </div>
      </div>
      <div className="dialogBox-bg-closer" onClick={(e)=>{this._click(e, 'close')}} />
    </div>
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