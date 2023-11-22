# Basic Resume Parser

This is the source code for an aws lambda function that parses through Resumes / CVs converts it to JSON and uploads the parsed data to a Google sheet.
It makes use of `easy-resume-parser` to parse through resumes of various formats and then finally adds the parsed data to a Google sheet.
This library supports parsing of CVs / Resumes in the word (.doc or .docx) / TXT / PDF / HTML format to extract the necessary information in a predefined JSON format.

# API for parsing resume (Sample):  
The following API invokes a sample lambda function that runs this project.

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
The parser is based on a dictionary of rules of how to handle a Resume file. It has a "/src/dictionary.js" file, where all rules are placed. I have tweaked the dictionary.js file as per some test resumes.

The dictionary file contains an object with the following structure:
{
	titles: {},
	inline: {},
	regular: {}
}
All of these keys - `titles, inline, regular` are converted to regular expressions, that are handled by specific conditions:

titles - fires on each row of file. If string matches title, so it will capture all text between current title and next title except current. For example we have such dictionary file:

If we now run application it will go through next Application Loop (AL):

- Remove unnecessary Resume file from any \n\r\t and trim all lines
- Compile rules to regular expressions
- Split file into lines, delimited by \n
- Check each line for a match for each title rules
- When a match is found, parse text between the current title and the next title into titles or until EOF
- Save parsed text (if found) under title key (objective or (and) summary)

inline - fires on each row of the file. It converts to a regular expression, that matches all data after that:
expr+":?[\\s]*(.*)"

Example:
```
inline: {
  skype: 'skype'
},
```
Text:

skype: sweet-liker

The result will be skype key with sweet-liker value in the Resume object. So it can be extended with simple lines of data, e.g. address or first name or whatever.

Note, that these rules are unreliable, cause can touch sensitive data from context, e.g. "I don't have a skype, but I have IM". After parsing that string data in the Resume will be as key skype and value but I have IM. So use at your own risk.

regular - fires on full data of the file. It just searches the first matches by regular expression, e.g:
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
Will try to find the name, email, and phone by regular expression.


## Extending
All actions are performed by building the `src/dictionary.js` file. Manipulating this file can be useful to parse various layouts of resumes. 

## Contributions

Many thanks to [Alexey Lizurchik](https://github.com/likerRr) for this amazing library. 
[https://github.com/likerRr/code4goal-resume-parser](https://github.com/likerRr/code4goal-resume-parser) 
