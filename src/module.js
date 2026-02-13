/**
 * Calculate a person's age in years.
 *
 * @param {object} p An object representing a person, implementing a birth Date parameter.
 * @return {number} The age in years of p.
 *  * @throws Will throw errors for missing or invalid parameters, invalid dates, or future birth dates.

 */
function calculateAge(p) {
    if (p === undefined || p === null) {
        throw new Error('missing param p');
    }
    if (typeof p !== 'object') {
        throw new Error('param p must be an object');
    }
    if (!('birth' in p)) {
        throw new Error('missing param p.birth');
    }
    const b = p.birth;
    if (!(b instanceof Date)) {
        throw new Error('p.birth must be a Date');
    }
    const time = b.getTime();
    if (isNaN(time)) {
        throw new Error('invalid date');
    }
    const now = new Date();
    if (b.getTime() > now.getTime()) {
        throw new Error('birth date is in the future');
    }

    const years_diff = now.getFullYear() - b.getFullYear();
    const month_diff = now.getMonth() - b.getMonth();
    const day_diff = now.getDate() - b.getDate();

    let age = years_diff;

    if (month_diff < 0 || (month_diff === 0 && day_diff < 0)) {
        age--;
    }

    return age;
}

// let loise = {
//     birth: new Date("11/07/1991")
// }
// console.log(calculateAge(loise))

export {calculateAge}