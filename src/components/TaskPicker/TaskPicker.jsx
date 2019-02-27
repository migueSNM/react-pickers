import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Query } from "react-apollo";
import gql from "graphql-tag";


const styles = {
  taskList: {
    width: '100%',
  },
  taskListItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  taskListItemText: {
    width: 10,
  },
  checkbox: {
    color: '#7b7b7b',
    '&$checked': {
      color: '#0288D1',
    },
  },
  checked: {},
  grow: {
    flexGrow: 1,
  },
  searchBox: {
    backgroundColor: '#FFFFFF61',
    borderRadius: 10,
    paddingLeft: 10,
    display: 'flex',
    alignItems: 'center',
  },
  searchBoxText: {
    color: '#FFFFFF',
  },
  closeButton: {
    color: '#FFFFFF',

  }
};

class TaskPicker extends React.Component {
  state = {
    bottom: false,
    checked: [],
    applied: [],
    searchText: '',
  };

  toggleDrawer = (side, open) => () => {
    // console.log('state ', this.state);
    this.setState({
      [side]: open,
      searchText: '',
    });
  };

  handleSelectItem = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleSelectAll = ( { tasks: { docs } }) => event => {
    const { checked } = this.state;
    const newChecked = [...checked];

    const selectAll = event.target.checked;

    docs.map( ({ _id : taskId }) => {
      const currentIndex = newChecked.indexOf(taskId);

      if (currentIndex === -1 && selectAll) {
        newChecked.push(taskId);
      } else if (!selectAll) {
        newChecked.splice(currentIndex, 1);
      }
      return true;
    });

    this.setState({
      checked: newChecked,
    });
  };

  handleSearchChange = () => event => {
    this.setState({
      searchText: event.target.value,
    });
  };

  handleApply = () => () => {
    this.setState({
      applied: this.state.checked,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button onClick={this.toggleDrawer('bottom', true)}>Task Picker</Button>
        <Drawer
          anchor="bottom"
          open={this.state.bottom}
          onClose={this.toggleDrawer('bottom', false)}
        >
          <Query
            query={gql`
              query tasks {
                tasks {
                  docs {
                    _id
                    code
                    name
                    description
                  }
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <List className={classes.taskList}>
                  <AppBar position="static">
                    <Toolbar>
                      <IconButton onClick={this.toggleDrawer('bottom', false)} className={classes.closeButton} aria-label="Close">
                        <CloseIcon />
                      </IconButton>
                      <Typography variant="h6" color="inherit" className={classes.grow}>
                        Tasks
                      </Typography>
                      <div className={classes.searchBox}>
                        <SearchIcon />
                        <InputBase
                          placeholder="Search…"
                          className={classes.searchBoxText}
                          onChange={this.handleSearchChange()
                          }
                        />
                      </div>
                      <Button onClick={this.handleApply(data)} color="inherit">Apply</Button>
                    </Toolbar>
                  </AppBar>
                  <ListItem role={undefined} dense className={classes.taskListItem}>
                    <Checkbox
                      onChange={this.handleSelectAll(data)}
                      value="selectAll"
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                      }}
                    />
                    <ListItemText className={classes.taskListItemText} secondary={`Code`} />
                    <ListItemText className={classes.taskListItemText} secondary={`Name`} />
                    <ListItemText className={classes.taskListItemText} secondary={`Description`} />
                  </ListItem>
                  <Divider variant="middle" />

                  {data.tasks.docs
                    .filter(task => Object.entries(task).some(val =>
                        val[0] !== '_id' && val[1].includes(this.state.searchText)
                    ))
                    .map(({ _id, code, name, description }, index) => (
                    <ListItem
                      key={index}
                      role={undefined}
                      dense
                      button
                      onClick={this.handleSelectItem(_id)}
                      className={classes.taskListItem}
                    >
                      <Checkbox
                        checked={this.state.checked.indexOf(_id) !== -1}
                        tabIndex={-1}
                        disableRipple
                        classes={{
                          root: classes.checkbox,
                          checked: classes.checked,
                        }}
                      />
                      <ListItemText className={classes.taskListItemText} primary={`${code}`} />
                      <ListItemText className={classes.taskListItemText} primary={`${name}`} />
                      <ListItemText className={classes.taskListItemText} primary={`${description}`} />
                    </ListItem>
                  ))}
                </List>
              );
            }}
          </Query>
        </Drawer>
      </div>
    );
  }
}

TaskPicker.propTypes = {
  classes: PropTypes.shape().isRequired,
};

export default withStyles(styles)(TaskPicker);
