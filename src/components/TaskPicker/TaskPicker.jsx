import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import SortIcon from '@material-ui/icons/Sort';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Badge from '@material-ui/core/Badge';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { omit, groupBy, mapObject } from 'underscore';


const styles = {
  drawer: {
    height: '100%',
  },
  counterChip: {
    margin: '0 10px',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
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
    itemsFiltered: [],
    applied: [],
    searchText: '',
    rightDrawerValue: 0,
    sortBy: 'code',
    filterNestedOpen : {
      status: false,
      type: false,
      group: false,
    },
    filterChecked: {
      deleted: false,
      type: []
    },
    filterApplied: {
      deleted: false,
      type: []
    },
  };

  toggleDrawer = (side, open) => () => {
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

  handleOpenFilterOption = event => {
    const columnName = event.target.innerText;
    const newFilterNestedOpen = {...this.state.filterNestedOpen};
    newFilterNestedOpen[columnName] = !newFilterNestedOpen[columnName];
    this.setState({
      filterNestedOpen: newFilterNestedOpen,
    });
  };

  handleSelectFilterOption = (columnValue, columnName) => () => {

    const { filterChecked } = this.state;
    const currentIndex = filterChecked.map(function(e) { return e.value; }).indexOf(columnValue);
    const newFilterChecked = [...filterChecked];

    if (currentIndex === -1) {
      newFilterChecked.push({
        colName: columnName,
        value: columnValue
      });
    } else {
      newFilterChecked.splice(currentIndex, 1);
    }

    this.setState({
      filterChecked: newFilterChecked,
    });
  };

  handleSelectFilterDeleted = () => {
    const newFilterChecked = {...this.state.filterChecked};
    newFilterChecked.deleted = !this.state.filterChecked.deleted;
    this.setState({
      filterChecked: newFilterChecked,
    });
  };

  handleApplyFilter = () => {
    const { filterChecked } = this.state;
    const filtersToApply = {...filterChecked};

    // const groupedFilters = mapObject(groupBy(filtersToApply, 'colName'),
    //   clist => clist.map(filter => omit(filter, 'colName')));

    this.setState({
      filterApplied: filtersToApply,
    });
  };

  handleCleanFilter = () => {
    this.setState({
      filterChecked: {
        deleted: false,
        type: [],
      },
      filterApplied: {
        deleted: false,
        type: [],
      },
    });
  };

  handleFilterBadge = () => {
    const { deleted, type } = this.state.filterApplied;

    return (!deleted && !type.length);
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

  handleConfirm = () => {
    const checkedIds = this.state.checked;
    this.props.handleReturnedIds(checkedIds);
    //TODO cerrar el picker cuando se confirmen los tasks
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
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
                    groups {
                      name
                      code
                    }
                    audit {
                      _deletedAt
                    }
                  }
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              //  these distinct values are use to show the available values to filter
              // let distinctValues = {};
              // Object.keys(data.tasks.docs[0]).forEach( value => {
              //   distinctValues[value] = [...new Set(data.tasks.docs.map(task => task[value]))]
              // });

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
                        <Chip label={this.state.checked.length} className={classes.counterChip}/>
                      </Typography>
                      <div className={classes.searchBox}>
                        <SearchIcon />
                        <InputBase
                          placeholder="Search…"
                          className={classes.searchBoxText}
                          onChange={this.handleSearchChange()}
                        />
                      </div>
                      <IconButton onClick={this.toggleRightDrawer} className={classes.sortButton} aria-label="Sort">
                        <SortIcon />
                      </IconButton>
                      <IconButton onClick={this.toggleRightDrawer} className={classes.filterButton} aria-label="Filter">
                        <Badge color="secondary" variant="dot" invisible={this.handleFilterBadge()}>
                          <FilterListIcon />
                        </Badge>
                      </IconButton>
                      <IconButton onClick={this.handleConfirm} color="inherit" aria-label="Confirm">
                        <DoneIcon />
                      </IconButton>
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
                    .filter(task => {
                      if(this.state.filterApplied.deleted){
                        return task.audit._deletedAt
                      } else {
                        return true
                      }
                    })
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
                      {Object.keys(data.tasks.docs[0]).map(column =>
                        !column.startsWith('_') &&
                        (
                          <ListItem button key={column} onClick={this.handleSort(column)}>
                            <ListItemIcon>
                              <LibraryBooksIcon />
                            </ListItemIcon>
                            <ListItemText primary={column}/>
                          </ListItem>
                        ))
                      }
                    </List>
                  )}
                  {this.state.rightDrawerValue === 1 && (
                    <Fragment>
                      <List component="nav">
                        <ListItem button key="status" onClick={this.handleOpenFilterOption}>
                          <ListItemText inset primary="status" />
                          {this.state.filterNestedOpen.status ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={this.state.filterNestedOpen.status} timeout="auto" unmountOnExit>
                          <ListItem
                            key="deleted"
                            role={undefined}
                            dense
                            button
                            onClick={this.handleSelectFilterDeleted}
                            className={classes.taskListItem}
                          >
                            <Checkbox
                              checked={this.state.filterChecked.deleted}
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
                      <Button onClick={this.handleApplyFilter} color="inherit">Apply Filters</Button>
                      <Button onClick={this.handleCleanFilter} color="inherit">Clean Filters</Button>
                    </Fragment>

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
