import { BusinessDayCounter } from "../src/task1";

describe("task2", () => {
	const publicHolidays = [new Date('2013-12-25'), new Date('2013-12-26'), new Date('2014-01-01')];

	it("can count business days 2013-10-07 - 2013-10-09", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 1;

		expect(dayCounter.BusinessDaysBetweenTwoDates(new Date('2013-10-07'), new Date('2013-10-09'), publicHolidays)).toEqual(expectedResult);
	});

	it("can count business days 2013-12-24 - 2013-12-27", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 0;

		expect(dayCounter.BusinessDaysBetweenTwoDates(new Date('2013-12-24'), new Date('2013-12-27'), publicHolidays)).toEqual(expectedResult);
	});

	it("can count business days 2013-10-07 - 2014-01-01", () => {
		const dayCounter = new BusinessDayCounter();
		const expectedResult = 59;

		expect(dayCounter.BusinessDaysBetweenTwoDates(new Date('2013-10-07'), new Date('2014-01-01'), publicHolidays)).toEqual(expectedResult);
	});
});
