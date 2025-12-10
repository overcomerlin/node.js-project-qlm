import { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

// manual Hook could be used by other components
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// create Provider component
export const LanguageProvider = ({ children }) => {
  // 'zh':chinese, 'en': english
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "zh" ? "en" : "zh"));
  };

  const value = { language, toggleLanguage };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
