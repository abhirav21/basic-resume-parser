
import ResumeParser from 'easy-resume-parser';
import { connectToGoogleSheet, addRow } from './utils/googlesheets.js'
import { processResume, createSheetObject } from './utils/helper.js'

export const handler = async (event) => {
    console.log("-- invoking resume parser --");
    let resume;
    try {
        resume = await new ResumeParser(event?.queryStringParameters?.cv);
    }
    catch (err) {
        console.error('rm_resumeParser_error', err);
    }

    let resumeJson;
    try {
        //use parseToJSON to get JSON from jsonparser
        resumeJson = await resume.parseToJSON();
    }
    catch (err) {
        console.log('rm_JSONParser_error', err);
    }
        // create sheet object (to used later to add row to google sheets)
    let sheetInsertObject = createSheetObject(resumeJson);
   
    try {
         //Add extra processing to weed out minor issues in name parsing etc.
         sheetInsertObject = processResume(resumeJson, sheetInsertObject);
    }
    catch (err) {
        console.log('rm_processResume_error', err);
    }
    
    try {
        //connect to google sheet
        const sheetConn = await connectToGoogleSheet();
        //add data as a row to google sheet
        await addRow(sheetConn, sheetInsertObject);

    }
    catch (err) {
        console.log('rm_addRow_error', err);
    }


    return {
        statusCode: 200,
        body: JSON.stringify({
            success: "resume parsing successful",
            parsedData: sheetInsertObject
        }),
    };
};


