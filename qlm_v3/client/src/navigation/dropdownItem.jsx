import {
  MDBBtn,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBNavbarLink,
} from "mdb-react-ui-kit";
import { NavLink } from "react-router-dom";
export default function DropdownItem({ itemText, ...rest }) {
  return (
    <MDBNavbarItem className="mx-2">
      <MDBDropdown>
        <MDBDropdownToggle tag="a" className="nav-link" role="button">
          <MDBBtn color="dark" className="fs-6">
            {itemText}
          </MDBBtn>
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          {Object.values(rest)
            .filter(
              (element) => element && element.addr && element.dropdownItemText
            )
            .map((element) => (
              <MDBDropdownItem
                key={element.addr}
                tag={NavLink}
                to={element.addr}
                className="m-2 p-2 text-center"
              >
                <MDBBtn outline color="dark" className="fs-6 m-2">
                  {element.dropdownItemText}
                </MDBBtn>
              </MDBDropdownItem>
            ))}
        </MDBDropdownMenu>
      </MDBDropdown>
    </MDBNavbarItem>
  );
}
