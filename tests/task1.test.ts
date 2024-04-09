import { BusinessDayCounter } from "../src/task1";

describe("task1", () => {
	it("can count weekdays 2013-10-07 - 2013-10-09", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 1;

		expect(dayCounter.WeekdaysBetweenTwoDates(new Date('2013-10-07'), new Date('2013-10-09'))).toEqual(expectedResult);
	});

	it("can count weekdays 2013-10-05 - 2013-10-14", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 5;

		expect(dayCounter.WeekdaysBetweenTwoDates(new Date('2013-10-05'), new Date('2013-10-14'))).toEqual(expectedResult);
	});

	it("can count weekdays 2013-10-07 - 2014-01-01", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 61;

		expect(dayCounter.WeekdaysBetweenTwoDates(new Date('2013-10-07'), new Date('2014-01-01'))).toEqual(expectedResult);
	});

	it("can count weekdays 2013-10-07 - 2013-10-05", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 0;

		expect(dayCounter.WeekdaysBetweenTwoDates(new Date('2013-10-07'), new Date('2013-10-05'))).toEqual(expectedResult);
	});
});
