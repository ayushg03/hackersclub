import React, { useEffect, useRef } from 'react';
import { Button, ButtonLabel, Error } from '../../../components';

import { useDispatch, useSelector } from 'react-redux';
import { formActions } from '../../../store/form-slice';

import images from '../../../constants/images';
import { formText } from '../../../constants/data';

import styles from './EmailAddress.module.css';

import { errorMessages,apiURL } from '../../../constants/data';

import { motion } from 'framer-motion';


const getAndValidateUserData = async (data) => {
  const rollNumber= data.split('@')[0];
    try {
    
      const response = await fetch(`${apiURL}/api/get-user/${rollNumber}`);
      

      if (response.status === 200) {
         // Check if email is already registered
         console.log('hello');
          return 'INVALID';
           // Display error message for email already registered
        } else {
       

          return 'VALID';
          
        }
 
    } catch (error) {
     
      console.error('Error fetching user data:', error);
    }
  
};


const validateEmail = (value) => {
  if (value === '') {
    return 'EMPTY';
  } else if (!/^[\w\.-]+@rgipt\.ac\.in$/.test(value)) {
    return 'INVALID';
  } else {
    return  'VALID';
  }
};


const EmailAddress = ({ showNextElement }) => {
  const dispatch = useDispatch();
  const scrollDirection = useSelector((state) => state.form.scrollDirection);
  const pointer = useSelector((state) => state.form.pointer);
  let errorMessage = useSelector((state) => state.form.errorMessage);
  const formData = useSelector((state) => state.form.formData);
  const progress = useSelector((state) => state.form.progress);

  const inputRef = useRef();

  const emailAddress = formData.emailAddress;
  let emailIsValid =  validateEmail(emailAddress.trim());
  console.log(emailIsValid)
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);

  useEffect(() => {
    dispatch(
      formActions.setElementValidity({
        pointer,
        isValid: emailIsValid === 'VALID',
      })
    );

    if (emailIsValid === 'VALID') {
      dispatch(formActions.setErrorMessage(null));
      dispatch(
        formActions.setElementValidity({
          pointer,
          isValid: true,
        })
      );
    }

    if (emailIsValid === 'VALID' && progress < pointer * 100)
      dispatch(formActions.incrementProgress());
    else if (emailIsValid !== 'VALID' && progress !== (pointer - 1) * 100)
      dispatch(formActions.decrementProgress());
  }, [dispatch, emailIsValid, pointer, progress]);

  
  const emailChangeHandler = (event) => {
    dispatch(formActions.setErrorMessage(null));
    dispatch(formActions.setFormData({ emailAddress: event.target.value }));

    
  };

  const navigationHandler = () => {
    if (emailIsValid === 'EMPTY') {
      dispatch(
        formActions.setErrorMessage(errorMessages.emailAddressErrors[0])
      );
      if (progress !== (pointer - 1) * 100)
        dispatch(formActions.decrementProgress());
    } else if (emailIsValid === 'INVALID') {
      dispatch(
        formActions.setErrorMessage(errorMessages.emailAddressErrors[1])
      );
      if (progress !== (pointer - 1) * 100)
        dispatch(formActions.decrementProgress());
    } else if (emailIsValid === 'VALID') {
     
          dispatch(formActions.setElementValidity({ pointer, isValid: true }));
          dispatch(formActions.setErrorMessage(null));
          if (progress < pointer * 100) dispatch(formActions.incrementProgress());
    
          showNextElement();
        
        
      
    }
  };

  let footer = (
    <div className="button">
      <Button onClick={navigationHandler} />
      <ButtonLabel labelKey="Enter ↵" />
    </div>
  );

  if (emailIsValid === 'VALID') {
    footer = (
      <div className="button">
        <Button onClick={navigationHandler} />
        <ButtonLabel labelKey="Enter ↵" />
      </div>
    );
  }

  if (errorMessage && emailIsValid !== 'VALID') {
    footer = <Error message={errorMessage} />;
  }

  return (
    <motion.div
      initial={{ y: scrollDirection > 0 ? 300 : -300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={({ duration: 0.3 }, { opacity: { duration: 0.4 } })}
      className="containerF"
    >
      <div className="number">
        <span>{pointer}</span>
        <img src={images.rightArrow} alt="Right Arrow" />
      </div>

      <div className="formControl">
        <label>
          <span className="labelText">{formText.emailAddress.labelText}</span>
          <p className={`subLabelText ${styles.emailSubLabel}`}>
            <span>{formText.emailAddress.subLabelText}</span>
          </p>
        </label>

        <input
          type="text"
          id="emailAddress"
          name="emailAddress"
          placeholder="example@rgipt.ac.in"
          ref={inputRef}
          onChange={emailChangeHandler}
          value={emailAddress}
        />

        {footer}
      </div>
    </motion.div>
  );
};

EmailAddress.displayName = 'emailAddress';

export default EmailAddress;
