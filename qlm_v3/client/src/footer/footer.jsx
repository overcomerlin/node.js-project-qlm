import {
  MDBBtn,
  MDBContainer,
  MDBFooter,
  MDBIcon,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import {
  en,
  zh,
  footerPageSloganEmail,
  footerPageSloganFax,
  footerPageSloganTel,
  getText,
} from "../config";
import { useEffect } from "react";
import SwitchGeneral from "../main/inputFields/switchGeneral";
import { useLanguage } from "../main/utils/LanguageContext.jsx";

const LangSwitch = () => {
  const { toggleLanguage } = useLanguage();

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      LANGUAGE: false,
    },
  });

  const languageValue = watch("LANGUAGE");
  useEffect(() => {
    toggleLanguage();
  }, [languageValue]);
  return (
    <Controller
      key="LANGUAGE"
      name="LANGUAGE"
      control={control}
      render={({ field, fieldState }) => (
        <SwitchGeneral
          {...field}
          id="LANGUAGE"
          label={languageValue ? en : zh}
          error={fieldState.error}
          readOnly={false}
          disabled={false}
        />
      )}
    />
  );
};

export default function Footer() {
  const { language } = useLanguage(); // 從 Context 取得當前語言

  return (
    <MDBContainer fluid className="text-center my-2">
      <MDBFooter
        className="text-center text-lg-start text-white"
        style={{ backgroundColor: "#014d5f" }}
      >
        <MDBContainer className="p-4 pd-0">
          <section className="">
            <MDBRow>
              <MDBCol md="4" lg="4" xl="4" className="mx-auto mt-3">
                <h6 className="text-uppercase fw-bold mb-4">
                  {getText(language, "COMPANY_NAME")}
                </h6>
                <p>{getText(language, "footerPageSloganServiceExcellence")}</p>
                <p>{getText(language, "footerPageSloganProductInnovation")}</p>
                <p>
                  {getText(language, "footerPageSloganPatentCertification")}
                </p>
                <p>
                  {getText(language, "footerPageSloganSustainableDevelopment")}
                </p>
                <p>{getText(language, "footePageSloganSecurityAssurance")}</p>
              </MDBCol>
              <hr className="w-100 clearfix d-md-none" />
              <MDBCol md="4" lg="4" xl="4" className="mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  {getText(language, "footerPageSloganProducts")}
                </h6>
                <p>
                  <a className="text-white">
                    {getText(language, "footerPageSloganProductsJAS106")}
                  </a>
                </p>
                <p>
                  <a className="text-white">
                    {getText(language, "footerPageSloganProductsJAS208S")}
                  </a>
                </p>
                <p>
                  <a className="text-white">
                    {getText(language, "footerPageSloganProductsJAS208U")}
                  </a>
                </p>
                <p>
                  <a className="text-white">
                    {getText(language, "footerPageSloganProductsJAS306SD")}
                  </a>
                </p>
              </MDBCol>{" "}
              <hr className="w-100 clearfix d-md-none" />
              <MDBCol md="4" lg="4" xl="4" className="mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold">
                  {getText(language, "footerPageSloganContactUs")}
                </h6>
                <p>
                  <MDBIcon fas icon="home" />
                  {getText(language, "footerPageSloganAddress")}
                </p>
                <p>
                  <MDBIcon far icon="envelope" />
                  {footerPageSloganEmail}
                </p>
                <p>
                  <MDBIcon fas icon="phone-alt" />
                  {footerPageSloganTel}
                </p>
                <p>
                  <MDBIcon fas icon="fax" />
                  {footerPageSloganFax}
                </p>
              </MDBCol>
            </MDBRow>
          </section>
          <hr className="my-3" />
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                <div className="p-3">
                  ©{format(new Date(), "yyyy")}
                  <a className="text-white" href="#">
                    {" " + getText(language, "COMPANY_NAME")}
                  </a>
                </div>
              </div>
              <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                <MDBBtn
                  outline
                  color="light"
                  floating
                  className="m-1"
                  href="#!"
                  role="button"
                >
                  <MDBIcon fab icon="facebook-f" />
                </MDBBtn>
                <MDBBtn
                  outline
                  color="light"
                  floating
                  className="m-1"
                  href="#!"
                  role="button"
                >
                  <MDBIcon fab icon="twitter" />
                </MDBBtn>
                <MDBBtn
                  outline
                  color="light"
                  floating
                  className="m-1"
                  href="#!"
                  role="button"
                >
                  <MDBIcon fab icon="google" />
                </MDBBtn>
                <MDBBtn
                  outline
                  color="light"
                  floating
                  className="m-1"
                  href="#!"
                  role="button"
                >
                  <MDBIcon fab icon="instagram" />
                </MDBBtn>
                <MDBBtn
                  outline
                  color="light"
                  floating
                  className="m-1"
                  href="#!"
                  role="button"
                >
                  <MDBIcon fab icon="linkedin" />
                </MDBBtn>
                <MDBBtn
                  outline
                  color="light"
                  floating
                  className="m-1"
                  href="#!"
                  role="button"
                >
                  <MDBIcon fab icon="github" />
                </MDBBtn>
                <LangSwitch />
              </div>
            </div>
          </section>
        </MDBContainer>
      </MDBFooter>
    </MDBContainer>
  );
}
