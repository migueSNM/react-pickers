import React from "react";
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  searchBox: {
    borderRadius: 10,
    paddingLeft: 10,
    display: 'flex',
    alignItems: 'center',
  },
  searchBoxText: {
    color: '#FFFFFF',
  },
};

class SearchBox extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.searchBox}>
        <SearchIcon />
        <InputBase
          placeholder="Search…"
          className={classes.searchBoxText}
          onChange={this.props.handleSearchChange()}
        />
      </div>
    )
  }
}

export default withStyles(styles)(SearchBox);
