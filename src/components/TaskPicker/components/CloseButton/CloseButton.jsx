import React from "react";
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  closeButton: {
    color: '#FFFFFF',
  },
};

class CloseButton extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <IconButton onClick={this.props.closeDrawer} className={classes.closeButton} aria-label="Close">
        <CloseIcon />
      </IconButton>
    )
  }
}

export default withStyles(styles)(CloseButton);
