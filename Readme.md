# Basic Resume Parser

This is a NodeJs repo to parse through Resume / CV to JSON and upload the parsed data to a google sheet.
Makes use of `easy-resume-parser` to parse through resumes of various formats and then finally adds the parsed data to a google sheet.
This library supports parsing of CVs / Resumes in the word (.doc or .docx) / TXT / PDF / HTML format to extract the necessary information in a predefined JSON format.

# API for parsing resume (Sample):  
The following api invokes a lambda function which runs this project.

GET `https://ytd3q47oe4.execute-api.ap-south-1.amazonaws.com/test/resumeParser`

queryparameter : `cv` (for specifying cv url)

sample GET request:

`https://ytd3q47oe4.execute-api.ap-south-1.amazonaws.com/test/resumeParser?cv=https://resume-tern.s3.ap-south-1.amazonaws.com/resume+abhirav.docx`

# Google Sheet link: 
`https://docs.google.com/spreadsheets/d/1wWLbMK0BeVoAshFfesIGYav6MjZo6P2NKRzdS-azfl4/edit#gid=0`


## Features
Supports the following formats provided by [textract]
 - PDF
 - DOC
 - DOCX
 - TXT
 - HTML

## Dependencies
 - `google-spreadsheet` for reading/writning data to a google sheet.
 - This project extends "easy-resume-parser" and has the very same dependencies.
    - `cheerio`
    - `mime`
    - `request`
    - `textract`
    - `tracer`
    - `underscore`

## How it Works
Base principle on how parser works, based on dictionary of rules of how to handle Resume file. So we have "/src/dictionary.js" file, where all rules places. It represents javascript object with the following structure:
{
	titles: {},
	inline: {},
	regular: {}
}
All of these keys titles, inline, regular are converted to regular expressions, that handled by specific conditions:

titles - fires on each row of file. If string matches title, so it will capture all text between current title and next title except current. For example we have such dictionary file:

If we now run application it will go through next Application Loop (AL):

- Remove unnecessary Resume file from any \n\r\t and trim all lines
- Compile rules to regular expressions
- Split file into lines, delimited by \n
- Check each line for a match for each title rules
- When match found, parse text between current title and next title into titles or until EOF
- Save parsed text (if found) under title key (objective or (and) summary)

inline - fires on each row of file. It converts to regular expression, that matches all data after that:
expr+":?[\\s]*(.*)"

Example:
```
inline: {
  skype: 'skype'
},
```
Text:

skype: sweet-liker

Result will be skype key with sweet-liker value in Resume object. So it can be extended with simple lines of data, e.g. address or first name or whatever.

Note, that these rules are unreliable, cause can touch sensitive data from context, e.g. "I don't have a skype, but I have IM". After parsing that string data in Resume will be as key skype and value but I have IM. So use on your own risk.

regular - fires on full data of file. It just search the first matches by regular expression, e.g:
```
regular: {
    name: [
        /[a-zA-Z]+[ a-zA-Z]*/
    ],
    email: [
        /([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})/
        ],
    phone: [
        /(\+91)?(-)?\s*?(91)?\s*?(\d{3})-?\s*?(\d{3})-?\s*?(\d{4})/
        ],
    }
```
Will try find name, email, phone by expression sign.


## Extending
All 'action' are by building `src/dictionary.js` file. Manipulating this file can be useful to parse various layouts of resumes. 

## Contributions

Many thanks to [Alexey Lizurchik](https://github.com/likerRr) for this amazing library. 
[https://github.com/likerRr/code4goal-resume-parser](https://github.com/likerRr/code4goal-resume-parser) 