import { NavLink } from "react-router-dom";
import { MDBBtn, MDBNavbarItem, MDBNavbarLink } from "mdb-react-ui-kit";
export default function ModuleItem({ to, color, itemText }) {
  return (
    <MDBNavbarItem className="mx-2">
      <MDBNavbarLink tag={NavLink} to={to}>
        <MDBBtn color={color} className="fs-6">
          {itemText}
        </MDBBtn>
      </MDBNavbarLink>
    </MDBNavbarItem>
  );
}
