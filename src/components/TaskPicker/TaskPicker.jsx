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
};

class TaskPicker extends React.Component {
  state = {
    bottom: false,
    checked: [],
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleToggle = value => () => {
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
                  <ListItem role={undefined} dense className={classes.taskListItem}>
                    <Checkbox disabled />
                    <ListItemText className={classes.taskListItemText} secondary={`Code`} />
                    <ListItemText className={classes.taskListItemText} secondary={`Name`} />
                    <ListItemText className={classes.taskListItemText} secondary={`Description`} />
                  </ListItem>
                  <Divider variant="middle" />

                  {data.tasks.docs.map(({ code, name, description }, index) => (
                    <ListItem key={index} role={undefined} dense button onClick={this.handleToggle(index)} className={classes.taskListItem}>
                      <Checkbox
                        checked={this.state.checked.indexOf(index) !== -1}
                        tabIndex={-1}
                        disableRipple
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
