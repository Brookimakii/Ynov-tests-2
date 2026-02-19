import { calculateAge } from "../../module"

let people20years;
beforeEach(() => {
    let date = new Date();
    people20years = {
        birth: new Date(date.setFullYear(date.getFullYear() - 20))
    };
})
/**
* @function calculateAge
*/
describe('calculateAge Unit Test Suites', () => {
    const today = new Date();
    
    it('should return a correct age', () => {
        let person = {birth: new Date('11/07/1991')};
        expect(calculateAge(person)).toBe(34); 
    });
    it('should throw a "missing param p" error', () => {
        expect(() => calculateAge()).toThrow('missing param p');
    })
    it('should throw when param p is not an object', () => {
        expect(() => calculateAge(123)).toThrow('param p must be an object');
    });

    it('should throw when p.birth is missing', () => {
        expect(() => calculateAge({})).toThrow('missing param p.birth');
    });

    it('should throw when p.birth is not a Date', () => {
        expect(() => calculateAge({ birth: '1991-11-07' })).toThrow('p.birth must be a Date');
    });

    it('should throw when p.birth is an invalid Date', () => {
        expect(() => calculateAge({ birth: new Date('invalid date') })).toThrow('invalid date');
    });

    it('should throw when birth date is in the future', () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        expect(() => calculateAge({ birth: tomorrow })).toThrow('birth date is in the future');
    });

    it('should return 0 for a birth date of today', () => {
        const person = { birth: new Date() };
        expect(calculateAge(person)).toBe(0);
    });

    it('should return 1 for someone born exactly one year ago', () => {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        const person = { birth: lastYear };
        expect(calculateAge(person)).toBe(1);
    });

    it("calculates age correctly when birthday already passed this year", () => {
        const birthDate = new Date(today.getFullYear() - 25, today.getMonth() - 1, today.getDate());
        const age = calculateAge({ birth: birthDate });
        expect(age).toBe(25);
    });

    it("calculates age correctly when birthday is tomorrow", () => {
        const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
        const age = calculateAge({ birth: birthDate });
        expect(age).toBe(17);
    });

    it("calculates age correctly for leap year birthdate", () => {
        const birthDate = new Date("2004-02-29");
        const age = calculateAge({ birth: birthDate });
        expect(typeof age).toBe("number");
        expect(age).toBeGreaterThanOrEqual(0);
    });
})
