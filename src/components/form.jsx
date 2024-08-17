import styles from "../Css/form.module.css";
import React, { useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import toast, { Toaster } from "react-hot-toast";
import CountDown from "./CountDown";

const successNitification = (message) =>
  toast.success(message, {
    duration: 3000,
    position: "top-center",
  });
const errorNitification = (message) =>
  toast.error(message, {
    duration: 3000,
    position: "top-center",
  });

let titles = ["Mr", "Mrs", "Miss", "Dr", "Ms", "Prof"];

const RegistrationForm = ({PageChange}) => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    isdCode: "",
    mobileNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isdCodes, setIsdCodes] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [OTP, setOTP] = useState("");
  const [isOTP, setisOTP] = useState(false);
  const [appOTP, setappOTP] = useState("");
  const [WrongOtpCount, setWrongOtpCount] = useState(5)

  const startCountdown = () => {
    setIsActive(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setappOTP(() => "");
    setisOTP(() => false);
    setIsActive(() => false);
    setOTP(() => "");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Required";
    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.isdCode) newErrors.isdCode = "Required";
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[1-9][0-9]{5,11}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Invalid mobile number";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setisLoading(() => true);
    if(!appOTP){
      setisLoading(() => false);
      errorNitification("OTP Expired");
      return;
    }
    if(WrongOtpCount<1){
      setisLoading(() => false);
      errorNitification("Too many incorrect OTP attempts. Please try again later.");
      return;
    }
    if (OTP > 0 && appOTP == OTP) {
      axios
        .post("https://simplifi-backend.onrender.com/create-user", { ...formData })
        .then((response) => {
          setisLoading(() => false);
          if (response.data && !response.data.status) {
            errorNitification(response.data.message);
          } else {
            setFormData({
              title: "",
              name: "",
              isdCode: "",
              mobileNumber: "",
              email: "",
            })
            setOTP("")
            PageChange(true)
            successNitification(response.data.message);
          }
        })
        .catch((err) => {
          setisLoading(() => false);
          console.log("error", err);
        });
    } else {
      setWrongOtpCount(() => WrongOtpCount-1)
      setisLoading(() => false);
      errorNitification(`Invalid OTP. ${WrongOtpCount-1} attempts remaining.`);
    }
  };

  const fetchIsdCodes = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const codes = response.data.map((country) => ({
        name: country.name.common,
        dialCode:
          country.idd.root +
          (country.idd.suffixes ? country.idd.suffixes[0] : ""),
      }));
      setIsdCodes(codes);
    } catch (error) {
      console.error("Error fetching ISD codes:", error);
    }
  };

  function GenerateOTP(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setisLoading(() => true);
      let otp = Math.floor(100000 + Math.random() * 900000);
      setappOTP(() => otp);
      axios
        .post("https://simplifi-backend.onrender.com/verify-email", {
          email: formData.email,
          OTP: otp,
        })
        .then((response) => {
          if (response.data.status) {
            setIsActive(() => true);
            successNitification(response.data.message);
            setisLoading(() => false);
          } else {
            errorNitification(response.data.message);
            setisLoading(() => false);
          }
        })
        .catch((err) => {
          errorNitification("Something went wrong");
          setisLoading(() => false);
          console.log(err, "error message");
        });
    }
  }

  return (
    <div className={styles.formContainer}>
      {isLoading && <Loader />}
      <Toaster />
      <img className={styles.logoImg} src="/logoImg.png" alt="" />
      <p className={styles.formHeading}>Register as an expert</p>
      <form onSubmit={GenerateOTP} className={styles.form}>
        <div className={styles.flexBox}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                name="title"
                // onClick={fetchIsdCodes}
                list="titles"
                placeholder=""
                value={formData.title}
                onChange={handleChange}
                className={`${styles.selectinput} ${
                  errors.title ? styles.errorBorder : ""
                }`}
              />
              <span className={`${styles.span} ${
                  errors.title ? styles.errorColor : ""
                }`}>Mr./Mrs.*</span>
            </label>
            <datalist id="titles">
              {titles.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
            </datalist>
            {errors.title && (
              <div className={styles.error}>{errors.isdCode}</div>
            )}
          </div>

          <label className={styles.label}>
            <input
              value={formData.name}
              onChange={handleChange}
              type="text"
              name="name"
              placeholder=" "
              className={`${styles.input} ${
                errors.name ? styles.errorBorder : ""
              }`}
            />
            <span className={`${styles.span} ${
                  errors.name ? styles.errorColor : ""
                }`}>Name*</span>
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </label>
        </div>

        <div className={styles.flexBox}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input
                name="isdCode"
                onClick={fetchIsdCodes}
                list="isdCodes"
                placeholder=""
                value={formData.isdCode}
                onChange={handleChange}
                className={`${styles.selectinput} ${
                  errors.isdCode ? styles.errorBorder : ""
                }`}
              />
              <span className={`${styles.span} ${
                  errors.isdCode ? styles.errorColor : ""
                }`}>ISD*</span>
            </label>
            <datalist id="isdCodes">
              {isdCodes.map((code, index) => (
                <option key={index} value={code.dialCode}>
                  {code.name} ({code.dialCode})
                </option>
              ))}
            </datalist>
            {errors.isdCode && (
              <div className={styles.error}>{errors.isdCode}</div>
            )}
          </div>

          <label className={styles.label}>
            <input
              value={formData.mobileNumber}
              onChange={handleChange}
              type="number"
              name="mobileNumber"
              placeholder=" "
              // className={styles.input}
              className={`${styles.input} ${
                errors.mobileNumber ? styles.errorBorder : ""
              }`}
            />
            <span className={`${styles.span} ${
                  errors.mobileNumber ? styles.errorColor : ""
                }`}>Mobile Number*</span>
            {errors.mobileNumber && (
              <div className={styles.error}>{errors.mobileNumber}</div>
            )}
          </label>
        </div>

        <label className={styles.label}>
          <input
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder=" "
            name="email"
            className={`${styles.input} ${
              errors.title ? styles.errorBorder : ""
            }`}
            // className={styles.input}
          />
          <span className={`${styles.span} ${
                  errors.title ? styles.errorColor : ""
                }`}>Email ID*</span>
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </label>
        {!isActive && (
          <button className={styles.button} type="submit">
            Get OTP on email
          </button>
        )}

        {/* <button className={styles.button} type="submit">Submit</button> */}
      </form>
      {isActive && (
        <div className={styles.otpBox}>
          <label className={styles.label}>
            <input
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              type="number"
              placeholder=" "
              className={`${styles.input} ${
                errors.otp ? styles.errorBorder : ""
              }`}
              // className={styles.input}
            />
            <span className={`${styles.span} ${
                  errors.otp ? styles.errorColor : ""
                }`}>OTP*</span>
            {/* {errors.otp && <div className={styles.error}>{errors.email}</div>} */}
          </label>
          {}
          {!appOTP ? (
            <p onClick={GenerateOTP} className={styles.resendBtn}>
              Resend OTP
            </p>
          ) : (
            <CountDown
              startCountdown={startCountdown}
              isActive={isActive}
              setappOTP={setappOTP}
            />
          )}

          <button
            className={styles.otpBtn}
            onClick={handleSubmit}
            type="submit"
          >
            Submit OTP
          </button>
        </div>
      )}
      <p className={styles.accountText}>Already have an account? <span className={styles.signin}>Sign In</span></p>
    </div>
  );
};

export default RegistrationForm;
