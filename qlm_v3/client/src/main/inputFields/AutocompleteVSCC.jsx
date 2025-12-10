import { MDBInput, MDBValidation, MDBValidationItem } from "mdb-react-ui-kit";
import { useState, useEffect, useRef } from "react";
import "../../css/AutocompleteField.css";

/**
 * An autocomplete input component that displays a dropdown based on an externally provided list of suggestions.
 * As the user types, it shows a dropdown list with suggested options and when the externalSuggestions is not [].
 *
 * @param {object} props - The component's props.
 * @param {string} props.id - The unique ID for the input element.
 * @param {string} props.label - The label text for the input.
 * @param {string} props.value - The current value of the input.
 * @param {function(string): void} props.onChange - Callback function for when the input value changes.
 * @param {function(): void} props.onBlur - Callback function for when the input loses focus.
 * @param {object} [props.error] - An error object from form validation, which should contain a `message` property.
 * @param {boolean} [props.disabled=false] - Whether the input is disabled.
 * @param {string[]} props.externalSuggestions - An array of strings to be displayed in the dropdown as suggestions.
 */
export default function AutocompleteVSCC({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  searchField,
  disabled = false,
  externalSuggestions,
  ...props
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (externalSuggestions) {
      setSuggestions(externalSuggestions);
      setIsOpen(externalSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [externalSuggestions, inputValue]);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (externalSuggestions && inputValue.length <= 0) setIsOpen(true);
        else setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, inputValue]);

  const handleInputChange = (e) => {
    let newValue = e.target.value.toUpperCase();
    setInputValue(newValue);
    onChange(newValue); // Propagate change to react-hook-form
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    onChange(suggestion); // Propagate change to react-hook-form
    setIsOpen(false);
  };

  return (
    <div
      className="autocomplete-wrapper"
      ref={wrapperRef}
      style={{ position: "relative", marginBottom: "2rem" }}
    >
      <MDBValidationItem feedback={error?.message} invalid={!!error}>
        <MDBInput
          {...props}
          label={label}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          size="lg"
          className={error ? "is-invalid" : ""}
        />
        {isOpen && suggestions.length > 0 && (
          <ul className="autocomplete-suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </MDBValidationItem>
    </div>
  );
}
