import React from "react";
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import FilterListIcon from '@material-ui/icons/FilterList';

const styles = {
  filterButton: {
    color: '#FFFFFF',
  },
};

class FilterButton extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <IconButton onClick={this.props.toggleRightDrawer} className={classes.filterButton} aria-label="Filter">
        <Badge color="secondary" variant="dot" invisible={this.props.handleFilterBadge()}>
          <FilterListIcon />
        </Badge>
      </IconButton>
    )
  }
}

export default withStyles(styles)(FilterButton);
