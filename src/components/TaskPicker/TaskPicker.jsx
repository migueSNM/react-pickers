import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Query } from "react-apollo";
import gql from "graphql-tag";


const styles = {
  taskList: {
    width: '100%',
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
                  {data.tasks.docs.map(({ code, name }, index) => (
                    <ListItem key={index} role={undefined} dense button onClick={this.handleToggle(index)}>
                      <Checkbox
                        checked={this.state.checked.indexOf(index) !== -1}
                        tabIndex={-1}
                        disableRipple
                      />
                      <ListItemText primary={`${code}: ${name}`} />
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
