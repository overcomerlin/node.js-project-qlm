import { MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import { loadingData } from "../../config";

export default function ReturnLoadingError({ isLoading, isError, error }) {
  if (isLoading) {
    return (
      <MDBContainer className="my-5 text-center">
        <h2>{loadingData}</h2>
        <MDBSpinner />
      </MDBContainer>
    );
  }
  if (isError) {
    return (
      <MDBContainer className="my-5 text-center">
        <h2>{error.message}</h2>
      </MDBContainer>
    );
  }
}
