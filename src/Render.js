import { React, useState } from 'react';

const Render = () => {

    const [list, setList] = useState({});

    // TODO: move thsi one as json file and add more inputs cases and static html + unit test
    const formData = [
        { type: 'text', label: 'First Name', name: 'firstName' },
        { type: 'text', label: 'Last Name', name: 'lastName' },
        {
            type: 'select', label: 'Country', name: 'country', options: [
                {label: "", value: "" },
                { label: 'USA', value: 'usa' },
                { label: 'Canada', value: 'canada' },
                { label: 'UK', value: 'uk' },
            ]
        },
    ];


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('list:', list);

        let result = await fetch(
            'http://localhost:5000/save', {
            method: "post",
            body: JSON.stringify({formData: JSON.stringify(list), htmlJson: JSON.stringify(formData)}) ,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        result = await result.json();
        if(result){
            console.log('succefully saved');
        }
    };

    const setInputData = (inputValue, inputName) => {
        const newList = { ...list };
        newList[inputName] = inputValue
        setList(newList);
    }

    const renderInputs = () => {
        return formData.map((input, index) => {
            switch (input.type) {
                case 'text':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <input type='text' value={list[input.name] ?? ""} onChange={(e) => setInputData(e.target.value, input.name)} />
                        </div>
                    );
                case 'select':
                    return (
                        <div key={index}>
                            <label>{input.label}</label>
                            <select onChange={(e) => setInputData(e.target.value, input.name)}>
                                {input.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    );

                default:
                    return null
            }
        });
    };

    return <form onSubmit={handleSubmit}>
        {renderInputs()}
        <button type="submit">Submit</button>
    </form>
}


export default Render;