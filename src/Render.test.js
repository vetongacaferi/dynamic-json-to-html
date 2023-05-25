import { render, screen } from '@testing-library/react';

import Render from './Render.js';

describe('Test Render form', () => {

    // select html config
    const selectHtmlConfig = [{
        "type": "select",
        "name": "country",
        "label": "Country",
        "options": [
            {
                "label": "",
                "value": ""
            },
            {
                "label": "USA",
                "value": "usa"
            },
            {
                "label": "Canada",
                "value": "canada"
            },
            {
                "label": "UK",
                "value": "uk"
            },
            {
                "label": "Germany",
                "value": "germany"
            }
        ],
        "validations": [
            {
                "type": "isRequired",
                "value": true,
                "text": "Please select a country"
            }
        ]
    }];

    const radioHtmlConfig = [
        {
            "type": "radio",
            "name": "programmingLanguage",
            "label": "Please select your favorite language",
            "options": [
                {
                    "label": "C#",
                    "value": "csharp"
                },
                {
                    "label": "Javascript",
                    "value": "javascript"
                },
                {
                    "label": "Java",
                    "value": "java"
                },
                {
                    "label": "Sql",
                    "value": "sql"
                }
            ]
        }
    ];

    const textAreaConfig = [
        {
            "type": "textarea",
            "name": "feedback",
            "label": "Comment",
            "rows": "10",
            "cols": "50",
            "validations": [
                {
                    "type": "maxChar",
                    "value": 50,
                    "text": "You reached the maximum of 50 characters"
                }
            ]
        },
        {
            "type": "textarea",
            "name": "feedback-1",
            "label": "Comment",
            "rows": "10",
            "cols": "50",
            "validations": [
                {
                    "type": "maxChar",
                    "value": 50,
                    "text": "You reached the maximum of 50 characters"
                }
            ]
        },
        {
            "type": "textarea",
            "name": "feedback-2",
            "label": "Comment",
            "rows": "10",
            "cols": "50",
            "validations": [
                {
                    "type": "maxChar",
                    "value": 50,
                    "text": "You reached the maximum of 50 characters"
                }
            ]
        }
    ];

    it('textarea is render on html', () => {
        render(<Render formData={textAreaConfig} />)
        expect(screen.getByTestId('feedback')).toBeInTheDocument();
        expect(screen.getByTestId('feedback-1')).toBeInTheDocument();
        expect(screen.getByTestId('feedback-2')).toBeInTheDocument();
    });

    it(' test select default option', () => {
        render(<Render formData={selectHtmlConfig} />)
        expect(screen.getAllByRole('option').length).toBe(5);
    });

    it('test select option', () => {
        render(<Render formData={selectHtmlConfig} />)

        expect(screen.getByRole('option', { name: '' }).selected).toBe(true);
        expect(screen.getAllByRole('option').length).toBe(5);
    });


    it('test radio option', () => {
        render(<Render formData={radioHtmlConfig} />)

        expect(screen.getAllByRole('radio').length).toBe(4);
    });
});
