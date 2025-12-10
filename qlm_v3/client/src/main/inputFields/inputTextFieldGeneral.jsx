import { MDBTextArea } from "mdb-react-ui-kit";

export default function InputTextFieldGeneral({
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
  const handleUppercase = (e) => {
    let newValue = e.target.value;
    if (uppercase) {
      newValue = newValue.toUpperCase();
    }
    onChange(newValue);
  };

  return (
    <div style={{ position: "relative", marginBottom: "0.5rem" }}>
      <MDBTextArea
        {...props}
        id={id}
        label={label}
        value={value}
        onChange={handleUppercase}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        rows="3"
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
