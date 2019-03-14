import React, {Fragment} from "react";
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


const styles = {
  taskListItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  taskListItemText: {
    width: 10,
    wordWrap: 'break-word'
  },
  checkbox: {
    color: '#7b7b7b',
    '&$checked': {
      color: '#0288D1',
    },
  },
  checked: {},
};

class FilterOptions extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <List component="nav">
          <ListItem button key="status" onClick={this.props.handleOpenFilterOption}>
            <ListItemText inset primary="status" />
            {this.props.filterNestedOpenStatus ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.props.filterNestedOpenStatus} timeout="auto" unmountOnExit>
            <ListItem
              key="deleted"
              role={undefined}
              dense
              button
              onClick={this.props.handleSelectFilterDeleted}
              className={classes.taskListItem}
            >
              <Checkbox
                checked={this.props.filterCheckedDeleted}
                tabIndex={-1}
                disableRipple
                classes={{
                  root: classes.checkbox,
                  checked: classes.checked,
                }}
              />
              <ListItemText className={classes.taskListItemText} primary='Show deleted' />
            </ListItem>
          </Collapse>
        </List>
        <Button onClick={this.props.handleApplyFilter} color="inherit">Apply Filters</Button>
        <Button onClick={this.props.handleCleanFilter} color="inherit">Clean Filters</Button>
        <Button onClick={this.props.toggleRightDrawer} color="inherit">Close Filters</Button>
      </Fragment>
    )
  }
}

export default withStyles(styles)(FilterOptions);
