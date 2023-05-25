import { React, useState } from 'react';

const Render = ({ formData }) => {

    const [inputsData, setInputsData] = useState({});
    const [validations, setValidations] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isValid = validateInputs(null);
        
        if (isValid) {
            let result = await fetch(
                'http://localhost:11000/save', {
                method: "post",
                body: JSON.stringify({ formData: JSON.stringify(inputsData), htmlJson: JSON.stringify(formData) }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            result = await result.json();
            if (result) {
                alert('succefully saved');
                setInputsData({});
            }
        }
    };

    const onInputChanged = (inputValue, inputName) => {
        const newList = { ...inputsData };
        newList[inputName] = inputValue;

        // perform validation;
        setInputsData(newList);
        validateInputs({ name: inputName, value: inputValue });
    }

    const validateInputs = (_input) => {
        let isValid = true;
        const newValidations = { ...validations };
        // validate one input, when input change
        if (_input && _input.name) {
            const findInputForm = formData.find(x => x.name === _input.name);
            newValidations[_input.name] = buildValidationText(findInputForm, _input.value);
        }
        // validate all inputs on submit
        else {
            for (const input of formData) {
                newValidations[input.name] = buildValidationText(input, inputsData[input.name]);
                if (newValidations[input.name]?.length > 0) {
                    isValid = false;
                }
            }
        };
        setValidations(newValidations);
        return isValid;
    }

    const buildValidationText = (inputForm, inputValue) => {
        if (!inputForm.validations?.length) {
            return ""; // if it doesn't contain validation data it's always valid
        }
        else {
            var text = "";
            inputForm.validations.forEach(validation => {
                switch (validation.type) {
                    case "isRequired":
                        if (validation.value && !inputValue?.length) {
                            text += text?.length ? ", " + validation.text : validation.text;
                        }
                        break;
                    case "minChar":
                        if (inputValue && inputValue.length < validation.value) {
                            text += text?.length ? ", " + validation.text : validation.text;
                        }
                        break;
                    case "maxChar":
                        if (inputValue && inputValue.length > validation.value) {
                            text += text?.length ? ", " + validation.text : validation.text;
                        }
                        break;
                    default:
                        break;
                }
            });
            return text;
        }
    }

    const renderInputs = () => {
        return formData.map((input, index) => {
            switch (input.type) {
                case 'text':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <input type='text' value={inputsData[input.name] ?? ""} onChange={(e) => onInputChanged(e.target.value, input.name)} />
                            <span style={{ color: 'red' }}>{validations[input.name]}</span>
                        </div>

                    );
                case 'radio':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <div>
                                {input.options.map((option, optinIndex) => (
                                    <span key={optinIndex} style={input.verticalAlign ? { display: 'block' } : {}} >
                                        <input type="radio" name={input.name} checked={option.value === inputsData[input.name]} value={option.value} onChange={() => onInputChanged(option.value, input.name)} /> <label>{option.label}</label>
                                    </span>
                                ))}
                            </div>
                            <span style={{ color: 'red' }}>{validations[input.name]}</span>
                        </div>
                    );
                case 'select':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <select onChange={(e) => onInputChanged(e.target.value, input.name)}>
                                {input.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <span style={{ color: 'red' }}>{validations[input.name]}</span>
                        </div>
                    );
                case 'textarea':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <div>
                                <textarea data-testid={input.name} name={input.name} value={inputsData[input.name] ?? ""} rows={input.rows} cols={input.cols} onChange={(e) => onInputChanged(e.target.value, input.name)}></textarea>
                            </div>
                            <span style={{ color: 'red' }}>{validations[input.name]}</span>
                        </div>
                    )
                default:
                    return null;
            }
        });
    };

    return <form onSubmit={handleSubmit}>
        {renderInputs()}
        <button type="submit">Submit</button>
    </form>
}


export default Render;