import { React, useState } from 'react';

const Render = () => {

    const [inputsData, setInputsData] = useState({});
    const [validations, setValidations] = useState({});

    // TODO: move thsi one as json file and add more inputs cases and static html + unit test
    const formData = [
        {
            type: 'text',
            name: 'firstName',
            label: 'First Name',
            validations: [
                { type: "isRequired", value: true, text: "First name is requried" },
                { type: "minChar", value: 5, text: "Minimum character should be 5" },
                { type: "maxChar", value: 20, text: "Your first name should not contain more than 25 characters" }
            ]
        },
        {
            type: 'text',
            name: 'lastName',
            label: 'Last Name',
            validations: [
                { type: "isRequired", value: false, text: "Value is requried" },
                { type: "minChar", value: 3, text: "Minimum character should be 3" },
                { type: "maxChar", value: 10, text: "Your last name should not contain more than 25 characters" }
            ]
        },
        {
            type: 'select',
            name: 'country',
            label: 'Country',
            options: [
                { label: "", value: "" },
                { label: 'USA', value: 'usa' },
                { label: 'Canada', value: 'canada' },
                { label: 'UK', value: 'uk' },
            ],
            validations: [
                { type: "isRequired", value: true, text: "Please select a country" },
            ]
        },
        {
            type: 'radio',
            name: 'programmingLanguage',
            label: 'Please select your favorite language',
            options: [
                { label: "C#", value: "csharp" },
                { label: "Javascript", value: "javascript" },
                { label: "Java", value: "java" }
            ]
        },
        {
            type: 'radio',
            name: 'ageGroup',
            label: 'Please select your age',
            verticalAlign: true,
            options: [
                { label: "18 - 30", value: "30" },
                { label: "31 - 60", value: "60" },
                { label: "61 - 100", value: "100" }
            ]
        },
        {
            type: "textarea",
            name: "feedback",
            label: "Comment",
            rows: "10",
            cols: "50",
            validations: [
                { type: "maxChar", value: 50, text: "You reached the maximum of 50 characters" }
            ]
        }
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();
        validateInputs(null);
        console.log('inputsData:', inputsData);
        setInputsData({});

        // TODO: uncomment this to save on database

        // let result = await fetch(
        //     'http://localhost:5000/save', {
        //     method: "post",
        //     body: JSON.stringify({ formData: JSON.stringify(inputsData), htmlJson: JSON.stringify(formData) }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });

        // result = await result.json();
        // if (result) {
        //     alert('succefully saved');
        // }
    };

    const onInputChanged = (inputValue, inputName) => {
        const newList = { ...inputsData };
        newList[inputName] = inputValue;

        // perform validation;
        setInputsData(newList);
        validateInputs(inputName, inputValue);
    }

    const validateInputs = (inputName, inputValue) => {
        const newValidations = { ...validations };
        if (inputName) {
            const findInputForm = formData.find(x => x.name === inputName);
            newValidations[inputName] = buildValidationText(findInputForm, inputValue);
        }
        else {
            for (const input of formData) {
                newValidations[input.name] = buildValidationText(input, inputsData[input.name]);
            }
        };

        console.log('newValidations:', newValidations);
        setValidations(newValidations);
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
                            <span>{validations[input.name]}</span>
                        </div>

                    );
                case 'radio':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <div>
                                {input.options.map((option, optinIndex) => (
                                    <span style={input.verticalAlign ? { display: 'block' } : {}} >
                                        <input key={optinIndex} type="radio" name={input.name} checked={option.value === inputsData[input.name]} value={option.value} onChange={() => onInputChanged(option.value, input.name)} /> <label>{option.label}</label>
                                    </span>
                                ))}
                            </div>
                            <span>{validations[input.name]}</span>
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
                            <span>{validations[input.name]}</span>
                        </div>
                    );
                case 'textarea':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <div>
                                <textarea name={input.name} value={inputsData[input.name] ?? ""} rows={input.rows} cols={input.cols} onChange={(e) => onInputChanged(e.target.value, input.name)}></textarea>
                            </div>
                            <span>{validations[input.name]}</span>
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