import { MDBInput } from "mdb-react-ui-kit";

export default function InputNumberFieldGeneral({
  id,
  label,
  value,
  onChange,
  onBlur,
  readOnly,
  disabled,
  uppercase,
  error,
  ...props
}) {
  return (
    <div style={{ position: "relative", marginBottom: "0.5rem" }}>
      <MDBInput
        {...props}
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        type="number"
        step="1"
        className={error ? "is-invalid" : ""}
      />
      {error && (
        <div
          className="invalid-feedback"
          style={{
            display: "block",
            animation: "fadeIn 0.5s ease",
          }}
        >
          {error.message}
        </div>
      )}
    </div>
  );
}
