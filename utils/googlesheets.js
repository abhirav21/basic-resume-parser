import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const connectToGoogleSheet = async () => {
    const serviceAccountAuth = new JWT({
        email: process.env.GCP_EMAIL,
        key: process.env.GCP_KEY.split(String.raw`\n`).join('\n'),
        scopes: SCOPES,
    });
    //create connection to google sheet using a service account
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo()
    //Return sheet connection object
    return doc.sheetsByIndex[0];
}

export const addRow = async (sheet, sheetInsertObject) => {
    //code for adding data to google sheet
    await sheet.addRows([
        { ...sheetInsertObject },
    ])
}
