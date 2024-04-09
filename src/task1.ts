import { DateTime, Interval } from 'luxon';

export class BusinessDayCounter {
	WeekdaysBetweenTwoDates(firstDate: Date, secondDate: Date): number {
		const intervalArray = this.GetIntervalArray(firstDate, secondDate);
		if (!intervalArray?.length) {
			return 0;
		}

		return this.DayCounter(intervalArray);
	}

	BusinessDaysBetweenTwoDates(
		firstDate: Date,
		secondDate: Date,
		publicHolidays: Date[]
	): number {
		const intervalArray = this.GetIntervalArray(firstDate, secondDate);
		if (!intervalArray?.length) {
			return 0;
		}

		const pubHolidays = publicHolidays.map(ph => DateTime.fromJSDate(ph).toUTC());
		// const pubHolidays = this.getPublicHolidays(firstDate, secondDate);
		return this.DayCounter(intervalArray, pubHolidays);
	}

	private GetIntervalArray(firstDate: Date, secondDate: Date): (DateTime<true> | null)[] | undefined {
		const startDay = DateTime.fromJSDate(firstDate).plus({ days: 1 }).toUTC();
		const endDay = DateTime.fromJSDate(secondDate).toUTC();

		if (startDay.startOf("day") >= endDay.startOf("day")) {
			return;
		}

		return Interval.fromDateTimes(startDay, endDay).splitBy({ day: 1 }).map(d => d.start);
	}

	private DayCounter(interval: (DateTime<true> | null)[], publicHolidays?: (DateTime<true> | DateTime<false>)[]): number {
		let dayCounter = 0;

		for (const day of interval) {
			if (day) {
				if (day.isWeekend) {
					continue;
				}
				else {
					if (publicHolidays && publicHolidays.find(ph => ph.startOf("day").toISO() === day.startOf("day").toISO())) {
						continue;
					}
					else {
						dayCounter++;
					}
				}
			}
		}

		return dayCounter;
	}

	private getPublicHolidays(firstDate: Date, secondDate: Date): (DateTime<true> | DateTime<false>)[] {
		const startDay = DateTime.fromJSDate(firstDate).toUTC();
		const endDay = DateTime.fromJSDate(secondDate).toUTC();
		const holidayRules = [
			{
				date: '01-01',
				additionalDay: true
			},
			{
				date: '01-26',
				additionalDay: true
			},
			{
				date: '04-25'
			},
			{
				rule: {
					dayOrder: 2,
					weekDay: 1, //Monday
					month: '06'
				}
			},
			{
				rule: {
					dayOrder: 1,
					weekDay: 1, //Monday
					month: '10'
				}
			},
			{
				date: '12-25',
				additionalDay: true
			},
			{
				date: '12-26',
				additionalDay: true
			}
		];

		const isDateTime = (item: DateTime<true> | DateTime<false> | undefined): item is (DateTime<true> | DateTime<false>) => {
			return !!item;
		}

		const years = [startDay.year, endDay.year].filter((value, index, array) => array.indexOf(value) === index);
		let publicHolidays: (DateTime<true> | DateTime<false>)[] = [];

		years.forEach(year => {
			const annualHolidays = holidayRules.map(rule => {
				if (rule.date && rule.additionalDay) {
					let date = DateTime.fromJSDate(new Date(`${year}-${rule.date}`)).toUTC();
					while (true) {
						if (!date.isWeekend) {
							break;
						}
						date = date.plus({ days: 1 }).toUTC();
					}
	
					return date.toUTC();
				}
				else if (rule.rule) {
					const monthStart = DateTime.fromJSDate(new Date(`${year}-${rule.rule.month}-01`));
					const monthEnd = monthStart.plus({ months: 1 });
					const interval = Interval.fromDateTimes(monthStart, monthEnd).splitBy({ day: 1 }).map(d => d.start);
					let dayOrderCount = 1;
					for (const day of interval) {
						if (day?.weekday === rule.rule.weekDay) {
							if (dayOrderCount === rule.rule.dayOrder) {
								return day.toUTC();
							}
							else {
								dayOrderCount++;
							}
						}
					}
				}
				else if (rule.date) {
					return DateTime.fromJSDate(new Date(`${year}-${rule.date}`)).toUTC();
				}
			}).filter(isDateTime);
			publicHolidays = publicHolidays.concat(annualHolidays);
		});

		return publicHolidays;
	}
}


export async function go(): Promise<void> {
	const dayCounter = new BusinessDayCounter();
	const result = dayCounter.WeekdaysBetweenTwoDates(new Date('2013-10-05'), new Date('2013-10-14'));
	console.log(result);
}