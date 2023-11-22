import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const connectToGoogleSheet = async () => {
    const serviceAccountAuth = new JWT({
        email: process.env.GCP_EMAIL,
        key: process.env.GCP_KEY.split(String.raw`\n`).join('\n'),
        scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo()
    //Return sheet connection object
    return doc.sheetsByIndex[0];
}

export const addRow = async (sheet, sheetObject) => {
    await sheet.addRows([
        { ...sheetObject },
    ])
}