import joi from 'joi';
const URL_REGEX = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;


const SCRAPPING_PARAMS = joi.object().keys({
    startUrl: joi.string().regex(URL_REGEX).message('Not a valid URL').required(),
    maxDepth: joi.number().min(1).required(),
    maxTotalPages: joi.number().min(1).required()
});


export const VALIDATE_SCRAPPING = (params) => {
    const validate = SCRAPPING_PARAMS.validate(params, {abortEarly: false});
    return validate;
}