import React from "react";
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';

class DoneButton extends React.Component {
  render() {
    return (
      <IconButton onClick={this.props.handleConfirm} color="inherit" aria-label="Confirm">
        <DoneIcon />
      </IconButton>
    )
  }
}

export default DoneButton;
