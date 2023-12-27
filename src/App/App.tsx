import { FC, useState } from 'react';
import data from '../../flights.json';
import { Ticket } from '../components/Ticket/Ticket';
import { Flight2, PriceRange, Root } from './TypeApp';
import { Sidebar } from '../components/Sidebar/Sidebar';

import styles from './App.module.scss';

export const App: FC = () => {
	const [sortBy, setSortBy] = useState<'ascending' | 'descending' | 'time' | null>(null);
	const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000000 });
	const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
	const [selectedTransplantation, setSelectedTransplantation] = useState<string[]>([]);

	const flights = (data as Root)?.result?.flights || [];
	const flight: Flight2[] = flights.map((flight) => flight.flight);
	const bestPrices = (data as Root)?.result.bestPrices;

	return (
		<div className={styles.wrapper}>
			<Sidebar flight={flight} setSortBy={setSortBy} setPriceRange={setPriceRange} selectedAirlines={selectedAirlines} setSelectedAirlines={setSelectedAirlines} selectedTransplantation={selectedTransplantation} setSelectedTransplantation={setSelectedTransplantation} />
			<Ticket flight={flight} sortBy={sortBy} priceRange={priceRange} selectedAirlines={selectedAirlines} bestPrices={bestPrices} selectedTransplantation={selectedTransplantation} />
		</div>
	);
};
