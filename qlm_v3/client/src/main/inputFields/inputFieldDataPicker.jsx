import { MDBInput } from "mdb-react-ui-kit";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/inputFieldDatePicker.css";
import { zhTW } from "date-fns/locale/zh-TW";
import { forwardRef } from "react";
import { todayButtonLabel } from "../../config";
registerLocale("zh-TW", zhTW);

const CustomDateInput = forwardRef(
  ({ id, label, value, onClick, readOnly, disabled, ...props }, ref) => (
    <MDBInput
      {...props}
      id={id}
      label={label}
      value={value}
      ref={ref}
      onClick={onClick}
      readOnly={readOnly}
      disabled={disabled}
      size="lg"
    />
  )
);
CustomDateInput.displayName = "CustomDateInput";

export default function InputFieldDatePicker({
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
      <DatePicker
        selected={value}
        onChange={onChange}
        wrapperClassName="date-picker-wrapper"
        dateFormat="yyyy-MM-dd"
        locale="zh-TW"
        customInput={
          <CustomDateInput
            {...props}
            id={id}
            label={label}
            readOnly={readOnly}
          />
        }
        showYearDropdown
        scrollableYearDropdown
        showMonthDropdown
        scrollableMonthYearDropdown
        todayButton={todayButtonLabel}
        disabled={disabled}
      />
    </div>
  );
}
