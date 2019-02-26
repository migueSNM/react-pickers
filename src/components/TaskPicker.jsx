import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import { Query } from "react-apollo";
import gql from "graphql-tag";


const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
    height: '100%',
  },
};

class TaskPicker extends React.Component {
  state = {
    bottom: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {

    return (
      <div>
        <Button onClick={this.toggleDrawer('bottom', true)}>Open Bottom</Button>
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

              return data.tasks.docs.map(({ code, name }) => (
                <div key={code}>
                  <p>{code}: {name}</p>
                </div>
              ));
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
