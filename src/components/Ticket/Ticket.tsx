import { FC, useState } from 'react';
import { BestPrices, Flight2, PriceRange } from '../../App/TypeApp';
import { HiArrowLongRight } from 'react-icons/hi2';
import { MdOutlineAccessTime } from 'react-icons/md';

import styles from './Ticket.module.scss';

interface TicketProps {
	flight: Flight2[];
	sortBy: 'ascending' | 'descending' | 'time' | null;
	priceRange: PriceRange;
	selectedAirlines: string[];
	bestPrices: BestPrices;
	selectedTransplantation: string[];
}

export const Ticket: FC<TicketProps> = ({ flight, sortBy, priceRange, selectedAirlines, bestPrices, selectedTransplantation }) => {
	const [visibleCount, setVisibleCount] = useState(2);

	const sortByPrice = (a: Flight2, b: Flight2) => {
		const priceA = parseFloat(a.price.total.amount);
		const priceB = parseFloat(b.price.total.amount);

		const durationA = a.legs[0].segments[0].travelDuration + (a.legs[1]?.segments[1]?.travelDuration || 0);
		const durationB = b.legs[0].segments[0].travelDuration + (b.legs[1]?.segments[1]?.travelDuration || 0);

		if (sortBy === 'ascending') {
			if (priceA !== priceB) {
				return priceA - priceB;
			} else {
				return durationA - durationB;
			}
		} else if (sortBy === 'descending') {
			if (priceA !== priceB) {
				return priceB - priceA;
			} else {
				return durationB - durationA;
			}
		} else if (sortBy === 'time') {
			return durationA - durationB;
		} else {
			return 0;
		}
	};

	const splitDateTime = (dateTimeString: string) => {
		const date = new Date(dateTimeString);

		const months = ['янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];
		const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

		const month = months[date.getMonth()];
		const day = date.getDate();
		const weekday = weekdays[date.getDay()];

		const hours = date.getHours();
		const minutes = date.getMinutes();

		const addLeadingZero = (value: number) => (value < 10 ? `0${value}` : value);

		const formattedTime = `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
		const formattedDate = `${day} ${month}${weekday}`;

		return { date: formattedDate, time: formattedTime };
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;

		return `${hours} ч ${remainingMinutes} мин`;
	};

	return (
		<div className={styles.wrapper}>
			{flight
				.filter((item) => {
					const price = parseFloat(item.price.total.amount);
					return price >= priceRange.min && price <= priceRange.max;
				})
				.filter((item) => {
					if (selectedAirlines.length === 0) {
						return true;
					} else {
						return selectedAirlines.includes(item.carrier.caption);
					}
				})
				.filter((item) => {
					if (selectedTransplantation.includes('none')) {
						const bestFlightsUid = bestPrices.DIRECT.bestFlights.map((item) => item.carrier.uid);
						return bestFlightsUid.includes(item.carrier.uid);
					} else if (selectedTransplantation.includes('one')) {
						const bestFlightsUid = bestPrices.DIRECT.bestFlights.map((item) => item.carrier.uid);
						return !bestFlightsUid.includes(item.carrier.uid);
					} else {
						return true;
					}
				})
				.sort(sortByPrice)
				.slice(0, visibleCount)
				.map((item, index) => (
					<div key={index}>
						<div className={styles.head}>
							<p>{item.carrier.caption}</p>
							<div className={styles.priceBox}>
								<p className={styles.price}>{item.price.total.amount} ₽</p>
								<p className={styles.headText}>стоимость для одного взрослого пассажира</p>
							</div>
						</div>

						<div className={styles.infoBox}>
							<div className={styles.flexBox}>
								<p>{item.legs[0].segments[0].departureCity?.caption},</p>
								<p>{item.legs[0].segments[0].departureAirport.caption}</p>
								<p className={styles.uid}>({item.legs[0].segments[0].departureAirport.uid})</p>
								<HiArrowLongRight className={styles.arrow} />
								<p>{item.legs[0].segments[0].arrivalCity?.caption}, </p>
								<p>{item.legs[0].segments[0].arrivalAirport.caption}</p>
								<p className={styles.uid}>({item.legs[0].segments[0].arrivalAirport.uid})</p>
							</div>

							<div className={styles.line}></div>

							<div className={styles.timeBox}>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<span>{splitDateTime(item.legs[0].segments[0].departureDate).date}</span>
									<p>{splitDateTime(item.legs[0].segments[0].departureDate).time}</p>
								</div>

								<div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17 }}>
									{<MdOutlineAccessTime />}
									{formatDuration(item.legs[0].segments[0].travelDuration)}
								</div>

								<div style={{ display: 'flex', alignItems: 'center' }}>
									<p>{splitDateTime(item.legs[0].segments[0].arrivalDate).time}</p>
									<span>{splitDateTime(item.legs[0].segments[0].arrivalDate).date}</span>
								</div>
							</div>

							{selectedTransplantation.includes('none') ? (
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<div className={styles.miniLine}></div>
								</div>
							) : (
								<div className={styles.transplantationBox}>
									<div className={styles.microLine}></div>
									<p className={styles.transplantation}>1 пересадка</p>
									<div className={styles.microLine}></div>
								</div>
							)}

							<p className={styles.company}>рейс выполняет: {item.carrier.caption}</p>
						</div>

						<div className={styles.bigLine}></div>

						<div className={styles.infoBox}>
							<div className={styles.flexBox}>
								<p>{item.legs[1]?.segments[1]?.departureCity?.caption},</p>
								<p>{item.legs[1]?.segments[1]?.departureAirport.caption}</p>
								<p className={styles.uid}>({item.legs[1].segments[0].departureAirport.uid})</p>
								<HiArrowLongRight className={styles.arrow} />
								<p>{item.legs[1]?.segments[1]?.arrivalCity?.caption}, </p>
								<p>{item.legs[1]?.segments[1]?.arrivalAirport.caption}</p>
								<p className={styles.uid}>({item.legs[1].segments[0].arrivalAirport.uid})</p>
							</div>

							<div className={styles.line}></div>

							<div className={styles.timeBox}>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<span>{splitDateTime(item.legs[1]?.segments[1]?.departureDate).date}</span>
									<p>{splitDateTime(item.legs[1]?.segments[1]?.departureDate).time}</p>
								</div>

								<div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 17 }}>
									{<MdOutlineAccessTime />}
									{formatDuration(item.legs[1]?.segments[1]?.travelDuration)}
								</div>

								<div style={{ display: 'flex', alignItems: 'center' }}>
									<p>{splitDateTime(item.legs[1]?.segments[1]?.arrivalDate).time}</p>
									<span>{splitDateTime(item.legs[1]?.segments[1]?.arrivalDate).date}</span>
								</div>
							</div>

							{selectedTransplantation.includes('none') ? (
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<div className={styles.miniLine}></div>
								</div>
							) : (
								<div className={styles.transplantationBox}>
									<div className={styles.microLine}></div>
									<p className={styles.transplantation}>1 пересадка</p>
									<div className={styles.microLine}></div>
								</div>
							)}

							<p className={styles.company}>рейс выполняет: {item.carrier.caption} </p>
						</div>
						<button className={styles.button}>ВЫБРАТЬ</button>
					</div>
				))}

			{visibleCount < flight.length && (
				<button className={styles.btn} onClick={() => setVisibleCount((prevCount) => prevCount + 2)}>
					Показать еще
				</button>
			)}
		</div>
	);
};
