import React from "react";
import IconButton from '@material-ui/core/IconButton';
import SortIcon from '@material-ui/icons/Sort';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  sortButton: {
    color: '#FFFFFF',
  }
};

class SortButton extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <IconButton onClick={this.props.toggleRightDrawer} className={classes.sortButton} aria-label="Sort">
        <SortIcon />
      </IconButton>
    )
  }
}

export default withStyles(styles)(SortButton);
