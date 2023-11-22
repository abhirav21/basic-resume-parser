/* Function to add postprocessing to resumeparser */
export const processResume = (resumeJson, sheetObject) => {

    // Try and get details from personal profile
    if (resumeJson?.parts?.personal_profile) {
        /* Find Name */
        let personalDetailsList = resumeJson.parts.personal_profile.split("\n")
        // try and find name
        let name = ""
        for (let i = 0; i < personalDetailsList.length; i++) {
            let element = personalDetailsList[i]
            if (element.toLowerCase().indexOf("name") > -1) {
                let currentItem = element.toLowerCase();
                name = currentItem.split("name")[1];
                break;
            }
        }
        if (name) {
            // Uppercase first letter of each word
            // Overwrite name to sheet object from personal details
            sheetObject.Name = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ').replaceAll(/[^A-Za-z0-9. ]/g, "").trim();

        }
        /* Find Name*/

    }
    return sheetObject
}


export const createSheetObject = (resumeJson) => {
    return {
        Name: resumeJson?.parts?.name?.trim(),
        'Email address': resumeJson?.parts?.email?.trim(),
        // remove spaces
        Phone: resumeJson?.parts?.phone?.replace(/ /g, ''),
        Education: resumeJson?.parts?.education?.trim(),
        'Work experience': resumeJson?.parts?.experience?.trim(),
        Skills: resumeJson?.parts?.skills?.trim(),
        'Personal Details': resumeJson?.parts?.personal_profile?.trim()
    };

}
