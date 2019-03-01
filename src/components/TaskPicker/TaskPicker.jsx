import React, { Fragment } from 'react';
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
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Query } from "react-apollo";
import gql from "graphql-tag";


const styles = {
  drawer: {
    height: '100%',
  },
  taskList: {
    width: '100%',
    paddingTop: 0,
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
  },
  filterButton: {
    color: '#FFFFFF',
  },
  sortButton: {
    color: '#FFFFFF',
  }
};

function compareStringCaseInsensitive (string, searchString) {
  const str = string ? (string + '').toUpperCase() : '';
  const searchStr = searchString ? (searchString + '').toUpperCase() : '';
  return str.indexOf(searchStr) !== -1;
}

function dynamicSort(property) {
  let sortOrder = 1;

  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a,b) {

    const formatA = a[property] ? a[property].toString() : '';
    const formatB = b[property] ? b[property].toString() : '';

    if(sortOrder === -1){
      return formatB.localeCompare(formatA);
    }else{
      return formatA.localeCompare(formatB);
    }
  }
}

class TaskPicker extends React.Component {
  state = {
    bottom: false,
    rightDrawer: false,
    checked: [],
    applied: [],
    searchText: '',
    rightDrawerValue: 0,
    sortBy: 'code',
  };

  toggleDrawer = (side, open) => () => {
    // console.log('state ', this.state);
    this.setState({
      [side]: open,
      searchText: '',
    });
  };

  toggleRightDrawer = () => {

    this.setState({
      rightDrawer: !this.state.rightDrawer,
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

  handleSort = columnName => () => {
    this.setState({
      sortBy: columnName,
    });
  };

  handleTabChange = (event, value) => {
    this.setState({
      rightDrawerValue: value
    });
  };

  handleApply = () => {
    const checkedIds = this.state.checked;
    this.props.handleReturnedIds(checkedIds)
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
          classes={{
            paperAnchorBottom: classes.drawer,
          }}
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
                    price
                    type {
                      name
                    }
                  }
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
              <Fragment>
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
                      <IconButton onClick={this.toggleRightDrawer} className={classes.sortButton} aria-label="Sort">
                        <SortIcon />
                      </IconButton>
                      <IconButton onClick={this.toggleRightDrawer} className={classes.filterButton} aria-label="Filter">
                        <FilterListIcon />
                      </IconButton>
                      <Button onClick={this.handleApply} color="inherit">Apply</Button>
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
                    <ListItemText className={classes.taskListItemText} secondary={`Price`} />
                    <ListItemText className={classes.taskListItemText} secondary={`Type`} />
                  </ListItem>
                  <Divider variant="middle" />

                  {data.tasks.docs
                    .filter(task => Object.entries(task).some(val =>
                        val[0] !== '_id' && compareStringCaseInsensitive(val[1], this.state.searchText)
                    ))
                    .sort(dynamicSort(this.state.sortBy))
                    .map(({ _id, code, name, description, price, type}, index) => (
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
                      <ListItemText className={classes.taskListItemText} primary={`${code ? code : ''}`} />
                      <ListItemText className={classes.taskListItemText} primary={`${name ? name : ''}`} />
                      <ListItemText className={classes.taskListItemText} primary={`${description ? description : ''}`} />
                      <ListItemText className={classes.taskListItemText} primary={`${price ? price : ''}`} />
                      <ListItemText className={classes.taskListItemText} primary={`${type ? type.name : ''}`} />
                    </ListItem>
                  ))}
                </List>
                <Drawer
                  anchor="right"
                  open={this.state.rightDrawer}
                  onClose={this.toggleRightDrawer}
                >
                  <Tabs
                    value={this.state.rightDrawerValue}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabChange}
                  >
                    <Tab label="Sort" />
                    <Tab label="Filter" />
                  </Tabs>
                  {this.state.rightDrawerValue === 0 && (
                    <List component="nav">
                      Sort
                      {Object.keys(data.tasks.docs[0]).map(column =>
                        !column.startsWith('_') &&
                        (
                          <ListItem button key={column} onClick={this.handleSort(column)}>
                            <ListItemText primary={column}/>
                          </ListItem>
                        ))
                      }
                    </List>
                  )}
                </Drawer>
              </Fragment>
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
