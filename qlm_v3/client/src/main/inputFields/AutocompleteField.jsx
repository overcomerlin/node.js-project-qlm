import { MDBInput, MDBValidationItem } from "mdb-react-ui-kit";
import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import "../../css/AutocompleteField.css";

/**
 * A debounced autocomplete input field that provides suggestions from a local data list as the user types.
 * When a suggestion is selected, it can trigger a callback to populate other related fields.
 *
 * @param {object} props - The component's props.
 * @param {string} props.id - The unique ID for the input element.
 * @param {string} props.label - The label text for the input.
 * @param {string} props.value - The current value of the input.
 * @param {function(string): void} props.onChange - Callback function for when the input value changes.
 * @param {function(): void} props.onBlur - Callback function for when the input loses focus.
 * @param {object} [props.error] - An error object from form validation, which should contain a `message` property.
 * @param {string[]} props.autoCompleteDataList - The local array of strings to use for generating suggestions.
 * @param {function(number): void} props.handleAutoCompleteAllFields - Callback function triggered on suggestion click, passing the index of the selected item from the original list.
 * @param {boolean} [props.disabled=false] - Whether the input is disabled.
 * @param {boolean} [props.uppercase] - If true, transforms the input value to uppercase.
 * @param {number} [props.contentLength] - The minimum number of characters required to trigger the suggestion search.
 */
export default function AutocompleteField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  searchField,
  autoCompleteDataList,
  handleAutoCompleteAllFields,
  disabled = false,
  uppercase,
  contentLength,
  ...props
}) {
  const [inputValue, setInputValue] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (query) => {
        if (query.length < contentLength && contentLength !== 0) {
          setSuggestions([]);
          return;
        }
        try {
          let suggestionList = [];
          for (let i = 0; i < autoCompleteDataList.length; i++) {
            if (autoCompleteDataList[i].includes(query)) {
              suggestionList.push({ [autoCompleteDataList[i]]: i });
            }
          }
          setSuggestions(suggestionList);
          setIsOpen(suggestionList.length > 0);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      }, 300),
    [searchField]
  );

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      fetchSuggestions(inputValue);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [inputValue, fetchSuggestions]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    let newValue = e.target.value;
    if (uppercase) {
      newValue = newValue.toUpperCase();
    }
    setInputValue(newValue);
    onChange(newValue); // Propagate change to react-hook-form
  };

  const handleSuggestionClick = (suggestion, index) => {
    setInputValue(suggestion);
    onChange(suggestion); // Propagate change to react-hook-form
    handleAutoCompleteAllFields(index);
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
              <li
                key={index}
                onClick={() =>
                  handleSuggestionClick(
                    Object.keys(suggestion)[0],
                    suggestion[Object.keys(suggestion)[0]]
                  )
                }
              >
                {Object.keys(suggestion)[0]}
              </li>
            ))}
          </ul>
        )}
      </MDBValidationItem>
    </div>
  );
}
