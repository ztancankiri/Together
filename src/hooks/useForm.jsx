import { useState, useEffect } from "react";
//Form Hook
export const useForm = (validate, submit, isAlternate, alternateSubmit) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      decideSubmit();
    }
    setIsSubmitting(false);
  }, [errors]);

  const handleSubmit = (event) => {
    if (event)
      event.preventDefault();
    setIsSubmitting(true);
    setErrors(validate(values));
  };
  const decideSubmit = () => {
    if (isAlternate) {
      alternateSubmit();
    }
    else {
      submit();
    }
  };
  const handleChange = (event, name) => {
    if (name && name.length > 0) {
      //Calendars
      setValues(values => ({ ...values, [name]: event }));
    } else {
      if (!event.target) {
        setValues(values => ({ ...values, [event.name]: event.value }));
      }
      else {
        event.persist();
        setValues(values => ({ ...values, [event.target.name]: event.target.value }));
      }
    }
  };
  return {
    handleChange,
    handleSubmit,
    values,
    errors,
    isSubmitting
  };
};
