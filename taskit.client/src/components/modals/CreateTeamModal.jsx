import React, {useState, useContext} from 'react'
import {useNavigate} from "react-router-dom";
import TeamContext from "../../context/TeamContext";
import "./Modal.css"


const CreateTeamModal = ({onClose}) => {
    const {createTeam, createTeamResult, apiError, clearApiError} = useContext(TeamContext)
    const [errors, setErrors] = useState({});
    const [localError, setLocalError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });

    const handleClose() => {
        setErrors({});
        setLocalError("");
        clearApiError();
        onClose();
    }

    const validate = () => {
        const newErrors = {};

        if(!formData.name) newErrors.name = "Nazwa jest wymagana.";
        else if (formData.name.length >= 50) newErrors.name = "Nazwa może mieć maksymalnie 50 znaków";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


  return (
    <div>CreateTeamModal</div>
  )
}

export default CreateTeamModal