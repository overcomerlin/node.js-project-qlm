import { MDBCheckbox, MDBSwitch } from "mdb-react-ui-kit";

export default function SwitchGeneral({
  id,
  label,
  value,
  onChange,
  onBlur,
  readOnly,
  disabled,
  error,
  ...props
}) {
  return (
    <div style={{ position: "relative", marginBottom: "2rem" }}>
      <MDBSwitch
        {...props}
        id={id}
        label={label}
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        onBlur={onBlur}
        readOnly={readOnly}
        disabled={disabled}
        inline
      />
    </div>
  );
}
