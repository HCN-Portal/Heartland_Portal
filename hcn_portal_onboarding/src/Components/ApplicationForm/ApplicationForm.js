import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import NavigationBar from "../UI/NavigationBar/NavigationBar";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./ApplicationForm.css";
import { useDispatch, useSelector } from "react-redux";
import { submit_application, messageClear } from "../../store/reducers/appReducer";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  // Personal Details
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  dob: yup.string().required("Date of birth is required"),
  address1: yup.string().required("Address line 1 is required"),
  address2: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  country: yup.string().required("Country is required"),

  // Work Authorization
  citizenshipStatus: yup.string().required("Citizenship status is required"),
  workAuthorizationStatus: yup
    .string()
    .required("Work authorization status is required"),
  workAuthorizationType: yup
    .string()
    .required("Work authorization type is required"),
  eadStartDate: yup.date().required("EAD start date is required").nullable(),

  // Education Details
  highestDegreeEarned: yup.string().required("Highest degree is required"),
  fieldOfStudy: yup.string().required("Field of study is required"),
  universityName: yup.string().required("University name is required"),
  graduationYear: yup
    .string()
    .required("Graduation year is required")
    .matches(/^\d{4}-\d{2}$/, "Enter valid year and month (YYYY-MM)"),

  // Experience Details
  totalYearsExperience: yup.string().required("This field is required"),
  relevantSkills: yup.string().required("This field is required"),
  previousEmployer: yup.string().required("Please enter employer or N/A"),
  previousPosition: yup.string().required("Please enter role name or N/A"),
  whyJoin: yup.string().required("This field is required"),
  roleInterest: yup.string().required("This field is required"),
});

const ApplicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { successMessage, errorMessage } = useSelector((state) => state.application);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    alert("You are submitting your details!");
    dispatch(submit_application(data));
  };

  useEffect(() => {
    if (successMessage === "Application saved") {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate("/");
      }, 3000);
      dispatch(messageClear());
    } else if (errorMessage) {
      setTimeout(() => {
        dispatch(messageClear());
      }, 2000);
    }
  }, [successMessage, errorMessage, navigate, dispatch]);

  return (
    <div>
      <NavigationBar />
      <div>
        <div className="application-container">
          {/* <h1 className="application-title">Hoosier Community Network</h1> */}
          <p className="application-subtitle">Apply! To join us at HCN.</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="application-form">
            <div className="section-heading">
              <h2>Personal Details</h2>
            </div>
            <div className="two-column-grid">
              <div>
                <label>First Name *</label>
                <input
                  {...register("firstName")}
                  className="input-field"
                  placeholder="John"
                />
                <p className="error-text">{errors.firstName?.message}</p>
              </div>
              <div>
                <label>Last Name *</label>
                <input
                  {...register("lastName")}
                  className="input-field"
                  placeholder="Kim"
                />
                <p className="error-text">{errors.lastName?.message}</p>
              </div>
            </div>
            {/* <div>

        </div> */}
            <div className="input-field-single">
              <label>Preferred Name *</label>
              <input
                {...register("preferredName")}
                className="input-field"
                placeholder="John"
              />
              <p className="error-text">{errors.preferredName?.message}</p>
            </div>

            <div className="input-field-email">
              <label>Personal Email *</label>
              <input
                {...register("email")}
                type="email"
                className="input-field"
                placeholder="Type here"
              />
              <p className="error-text">{errors.email?.message}</p>
              <p className="error-text">{errorMessage}</p>
            </div>

            <div className="input-field-single">
              <label>Date of Birth *</label>
              <input {...register("dob")} type="date" className="input-field" />
              <p className="error-text">{errors.dob?.message}</p>
            </div>

            <div className="two-column-grid">
              <div>
                <label>Address Line 1 *</label>
                <input
                  {...register("address1")}
                  className="input-field"
                  placeholder="Type here"
                />
                <p className="error-text">{errors.address1?.message}</p>
              </div>
              <div>
                <label>Address Line 2</label>
                <input
                  {...register("address2")}
                  className="input-field"
                  placeholder="Type here"
                />
              </div>
            </div>

            <div className="three-column-grid">
              <div>
                <label>City *</label>
                <input
                  {...register("city")}
                  className="input-field"
                  placeholder="Type here"
                />
                <p className="error-text">{errors.city?.message}</p>
              </div>
              <div>
                <label>State *</label>
                <input
                  {...register("state")}
                  className="input-field"
                  placeholder="Type here"
                />
                <p className="error-text">{errors.state?.message}</p>
              </div>
              <div>
                <label>Country *</label>
                <input
                  {...register("country")}
                  className="input-field"
                  placeholder="Type here"
                />
                <p className="error-text">{errors.country?.message}</p>
              </div>
            </div>
            <div className="section-heading">
              <h2>Work Authorization Details</h2>
            </div>

            <div className="two-column-grid">
              <div>
                <label>Citizenship Status *</label>
                <select
                  {...register("citizenshipStatus")}
                  className="input-field"
                >
                  <option value="">Select Status</option>
                  <option value="US Citizen">US Citizen</option>
                  <option value="Permanent Resident">Permanent Resident</option>
                  <option value="US Visa Holder">US Visa Holder</option>
                </select>
                <p className="error-text">
                  {errors.citizenshipStatus?.message}
                </p>
              </div>
              <div>
                <label>Work Authorization Status *</label>
                <select
                  {...register("workAuthorizationStatus")}
                  className="input-field"
                  placeholder="Are you authorized to work in the US?"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <p className="error-text">
                  {errors.workAuthorizationStatus?.message}
                </p>
              </div>
            </div>

            <div style={{ width: "400px" }}>
              <label>Work Authorization Type *</label>
              <input
                {...register("workAuthorizationType")}
                className="input-field"
                placeholder="Please write your work authorization type and visa status."
              />
              <p className="error-text">
                {errors.workAuthorizationType?.message}
              </p>
            </div>

            <div style={{ width: "150px" }}>
              <label>EAD Start Date *</label>
              <input
                {...register("eadStartDate")}
                type="date"
                className="input-field"
              />
              <p className="error-text">{errors.eadStartDate?.message}</p>
            </div>
            <div className="section-heading">
              <h2>Educational Background</h2>
            </div>

            {/* <div className="application-form"> */}
            <div className="input-field-single" style={{ width: "250px" }}>
              <label>Highest Degree Earned *</label>
              <select
                {...register("highestDegreeEarned")}
                className="input-field"
              >
                <option value="">Dropdown option</option>
                <option value="High School Diploma/GED">
                  High School Diploma/GED
                </option>
                <option value="Associate's Degree">Associate's Degree</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Doctorate/Professional Degree">
                  Doctorate/Professional Degree
                </option>
              </select>
              <p className="error-text">
                {errors.highestDegreeEarned?.message}
              </p>
            </div>

            <div className="input-field-single" style={{ width: "320px" }}>
              <label>Field of Study *</label>
              <input
                {...register("fieldOfStudy")}
                type="text"
                className="input-field"
                placeholder="Type here"
              />
              <p className="error-text">{errors.fieldOfStudy?.message}</p>
            </div>

            <div className="input-field-single" style={{ width: "400px" }}>
              <label>University Name *</label>
              <input
                {...register("universityName")}
                type="text"
                className="input-field"
                placeholder="Type here"
              />
              <p className="error-text">{errors.universityName?.message}</p>
            </div>

            <div className="input-field-single">
              <label>Year of Graduation *</label>
              <input
                {...register("graduationYear")}
                type="month"
                className="input-field"
                placeholder="mm/yyyy"
              />
              <p className="error-text">{errors.graduationYear?.message}</p>
              <small>Expected/Graduation Month and Year</small>
            </div>
            {/* </div> */}

            <div className="section-heading">
              <h2>Professional Experience</h2>
            </div>

            {/* <div className="application-form"> */}
            <div className="input-field-single" style={{ width: "368px" }}>
              <label>Total Years of Professional Experience *</label>
              <select
                {...register("totalYearsExperience")}
                className="input-field"
              >
                <option value="">Dropdown option</option>
                <option value="1-2">1 - 2</option>
                <option value="2-3">2 - 3</option>
                <option value="3-4">3 - 4</option>
                <option value="4-5">4 - 5</option>
                <option value="5+">5+</option>
              </select>
              <p className="error-text">
                {errors.totalYearsExperience?.message}
              </p>
            </div>

            <div className="input-field-single">
              <label>Relevant Skills (Top 5 skills) *</label>
              <input
                type="text"
                {...register("relevantSkills")}
                className="input-field"
                placeholder="Type here"
              />
              <p className="error-text">{errors.relevantSkills?.message}</p>
            </div>

            <div className="input-field-single">
              <label>Previous Employer (Most Recent) *</label>
              <input
                type="text"
                {...register("previousEmployer")}
                className="input-field"
                placeholder="Type here"
              />
              <p className="error-text">{errors.previousEmployer?.message}</p>
            </div>

            <div className="input-field-single" style={{ width: "368px" }}>
              <label>Previous Position (Role Name) *</label>
              <input
                type="text"
                {...register("previousPosition")}
                className="input-field"
                placeholder="Type here"
              />
              <p className="error-text">{errors.previousPosition?.message}</p>
            </div>

            <div className="input-field-single">
              <label>
                Why do you want to join Hoosier Community Network? *
              </label>
              <textarea
                {...register("whyJoin")}
                className="input-field"
                placeholder="Write here"
                rows={3}
              ></textarea>
              <p className="error-text">{errors.whyJoin?.message}</p>
            </div>

            <div className="input-field-single">
              <label>Which type of role are you interested in? *</label>
              <textarea
                {...register("roleInterest")}
                className="input-field"
                placeholder="Write here"
                rows={3}
              ></textarea>
              <p className="error-text">{errors.roleInterest?.message}</p>
            </div>
            {/* </div> */}

            <button type="submit" className="submit-button">
              Submit Form
            </button>
          </form>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <p>Your application has been successfully submitted! Please check your inbox for further updates. Kindly note that the review process may take a few days. Thank you for your patience and for applying with us!</p>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ApplicationForm;
