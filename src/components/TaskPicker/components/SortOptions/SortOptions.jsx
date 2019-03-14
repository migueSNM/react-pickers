import React, {Fragment} from "react";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

class SortOptions extends React.Component {
  render() {
    return (
      <Fragment>
        <List component="nav">
          {Object.keys(this.props.taskColumns).map(column =>
            !column.startsWith('_') &&
            (
              <ListItem button key={column} onClick={this.props.handleSort(column)} selected={this.props.sortBy === column}>
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary={column}/>
              </ListItem>
            ))
          }
        </List>
        <Button onClick={this.props.toggleRightDrawer} color="inherit">Close Sorters</Button>
      </Fragment>
    )
  }
}

export default SortOptions;
