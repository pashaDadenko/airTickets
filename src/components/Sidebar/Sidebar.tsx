import { FC } from 'react';
import { Flight2, PriceRange } from '../../App/TypeApp';

import styles from './Sidebar.module.scss';

interface SidebarProps {
	setSortBy: (sortBy: 'ascending' | 'descending' | 'time' | null) => void;
	setPriceRange: React.Dispatch<React.SetStateAction<PriceRange>>;
	flight: Flight2[];
	selectedAirlines: string[];
	setSelectedAirlines: React.Dispatch<React.SetStateAction<string[]>>;
	selectedTransplantation: string[];
	setSelectedTransplantation: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Sidebar: FC<SidebarProps> = ({ setSortBy, setPriceRange, flight, selectedAirlines, setSelectedAirlines, selectedTransplantation, setSelectedTransplantation }) => {
	const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value as 'ascending' | 'descending' | 'time';
		setSortBy(value);
	};

	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setPriceRange((prevPriceRange: PriceRange) => ({
			...prevPriceRange,
			[name]: name === 'min' || name === 'max' ? parseInt(value, 10) : value,
		}));
	};

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = event.target;
		const updatedAirlines = selectedAirlines.includes(name) ? selectedAirlines.filter((item) => item !== name) : [...selectedAirlines, name];
		setSelectedAirlines(updatedAirlines);
	};

	const handleTransplantationCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name } = event.target;
		let updatedTransplantation: string[];
		if (name === 'one' && selectedTransplantation.includes('one')) {
			updatedTransplantation = selectedTransplantation.filter((item) => item !== 'one');
		} else if (name === 'none' && selectedTransplantation.includes('none')) {
			updatedTransplantation = selectedTransplantation.filter((item) => item !== 'none');
		} else {
			updatedTransplantation = [...selectedTransplantation, name];
		}
		setSelectedTransplantation(updatedTransplantation);
	};

	const uniqueAirCompanies = [...new Set(flight.map((item) => item.carrier.caption))];

	return (
		<div className={styles.wrapper}>
			<div className={styles.title}>Сортировать</div>
			{['ascending', 'descending', 'time'].map((sortType) => (
				<div key={sortType}>
					<input type='radio' id={sortType} name='sortOrder' value={sortType} onChange={handleSortChange} />
					<label htmlFor={sortType}> - {`по ${sortType === 'time' ? 'времени в пути' : sortType === 'ascending' ? 'возрастанию цены' : 'убыванию цены'}`}</label>
				</div>
			))}

			<div className={styles.title}>Фильтровать</div>
			{['one', 'none'].map((transplantationType) => (
				<div key={transplantationType}>
					<input type='checkbox' id={transplantationType} name={transplantationType} onChange={handleTransplantationCheckboxChange} />
					<label htmlFor={transplantationType}> - {transplantationType === 'one' ? '1 пересадка' : 'без пересадок'}</label>
				</div>
			))}

			<div className={styles.title}>Цена</div>
			{['min', 'max'].map((priceType) => (
				<div key={priceType}>
					<span>{priceType === 'min' ? 'От' : 'До'}</span>
					<input type='text' placeholder={priceType === 'min' ? '0' : '1000000'} name={priceType} onChange={handlePriceChange} />
				</div>
			))}

			<div className={styles.title}>Авиакомпании</div>
			{uniqueAirCompanies.map((company, index) => (
				<div key={index}>
					<input type='checkbox' id={`company${index}`} name={company} onChange={handleCheckboxChange} checked={selectedAirlines.includes(company)} />
					<label htmlFor={`company${index}`}> - {company}</label>
				</div>
			))}
		</div>
	);
};
