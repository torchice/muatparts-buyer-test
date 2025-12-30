export const hightlightText = (searchVal, text) => {
    if (!searchVal || !text) return text
    const sanitizeInput = (input) => {
        return input
            .replace(/&/g, '&amp;') 
            .replace(/</g, '&lt;')   
            .replace(/>/g, '&gt;')   
            .replace(/"/g, '&quot;') 
            .replace(/'/g, '&#x27;') 
            .trim();
    }
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }
    const cleanedVal = escapeRegExp(sanitizeInput(searchVal))
    const sanitizedText = sanitizeInput(text)
    const regex = new RegExp(cleanedVal, 'gi')
    return sanitizedText.replace(regex, "<b>$&</b>");
    
}
export const lineClamp = (text,len=45)=>{
    let netmp = ""
    if(text?.length>len) return netmp=`${text.slice(0,len)}...`
    return text
}