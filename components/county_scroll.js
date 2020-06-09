import React from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import CountySelectorList from '../assets/county_selector_list.json'
import Dropdown from 'react-bootstrap/Dropdown'

export default class CountyScroll extends React.Component {
  render() {
    return (
      <DropdownButton
        bsStyle="default"
        bsSize="small"
        style={{ maxHeight: "28px" }}
        title={this.props.title}
        key={1}
        id="dropdown-size-small"
      >
      {
        CountySelectorList.map((county) => (
          <Dropdown.Item onClick={() => {this.props.func(county)}}>{county}</Dropdown.Item>
        ))
      }
      </DropdownButton>
    )
  }
}
