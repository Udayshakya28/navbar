'use client';

import React, { useEffect, useRef, useState } from 'react';

import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

import { addDays, format, set } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; 
import "react-date-range/dist/theme/default.css";



import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
const locations = [
    'New Delhi',
    'London',
    'Switzerland',
    'Chicago',
    'Mohali',
    'Agra, Uttar Pradesh',
    'kerela',
    'Germany',
    'Jabalpur',
    'uttar pradesh ',
    'haryana',
    'west bengal',


];


export default function DynamicSearchBar() {
    const [location, setLocation] = useState('Anywhere');
    const [checkInDates, setCheckInDates] = useState('Any week');
    const [checkOutDates, setCheckOutDates] = useState('Any week');
    const [guests, setGuests] = useState(0);

    const [adultsCount, setAdultsCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [petsCount, setPetsCount] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
   
    const formatToYYYYMMDD = (date: any) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const day = date.getDate();
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${monthName} `;
    };

    const [selectedDateRange, setSelectedDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const onSelectDate = (ranges: any) => {
        const formattedStartDate = formatToYYYYMMDD(ranges.selection.startDate);
        const formattedEndDate = formatToYYYYMMDD(ranges.selection.endDate);
        setCheckInDates(formattedStartDate);
        setCheckOutDates(formattedEndDate)
        const formattedDateRange = [formattedStartDate, formattedEndDate];
        

        setSelectedDateRange([ranges.selection]);
    };

    const [searchBarActive, setSearchBarActive] = useState(false);



    const handleClickOutside = (event: any) => {
        const searchBarElement = event.target.closest('.dynamic-search-bar');
        const excludeElement = event.target.closest('.exclude-class');

        if (!searchBarElement && !excludeElement) {
           
            setSearchBarActive(false);
        } else if (searchBarElement) {
           
            setSearchBarActive(true);
        }
    };

    
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    
    const [query, setQuery] = useState(''); 
    const [filteredLocations, setFilteredLocations] = useState([]); 

   
    const handleLocSearch = (e: any) => {
        const value = e.target.value;
        setQuery(value);

       
        const filtered: any = locations.filter((location: any) =>
            location.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredLocations(filtered);
    };

    
    const handleSelectLocation = (location: any) => {
        setQuery(location);
        setLocation(location)
      
        setFilteredLocations([]); 
        setSearchModal(null); 
    };

    const scrollTimer = useRef<NodeJS.Timeout | null>(null);
    const lastScrollY = useRef(window.scrollY);
    const router = useRouter();



    const incrementCount = (type: string) => {
        if (type === 'adults') {
            setTotalGuests(totalGuests + 1);
            setAdultsCount(adultsCount + 1);
        } else if (type === 'children') {
            setChildrenCount(childrenCount + 1);
            setTotalGuests(totalGuests + 1);
        } else if (type === 'pets') {
            setPetsCount(petsCount + 1);
        
        }
    };


    const decrementCount = (type: string) => {
        if (type === 'adults' && adultsCount > 0) {
            setAdultsCount(adultsCount - 1);
            setTotalGuests(Math.max(totalGuests - 1, 0)); 
        } else if (type === 'children' && childrenCount > 0) {
            setChildrenCount(childrenCount - 1);
            setTotalGuests(Math.max(totalGuests - 1, 0));
        } else if (type === 'pets' && petsCount > 0) {
            setPetsCount(petsCount - 1);
        }
    };



    const handleSearch = () => {
        const Location = location.trim();
        const checkInDates = selectedDateRange[0]?.startDate?.toDateString() || 'Any week';
        const checkOutDates = selectedDateRange[0]?.endDate?.toDateString() || 'Any week';
        const totalGuestsCount = adultsCount + childrenCount + petsCount;
        const searchURL = `?location=${Location}&checkin=${checkInDates}&checkout=${checkOutDates}&adults=${adultsCount}&children=${childrenCount}&pets=${petsCount}&totalGuests=${totalGuestsCount}`;
        router.push(searchURL);
        setSearchBarActive(false);
        setSearchModal("");
    };

    const [searchModal, setSearchModal] = useState("")

    return (
        <div className="dynamic-search-bar  z-[100] w-auto min-w-[min-content]   sm:max-w-full flex flex-col items-center transition-all duration-500">
            <div
                onClick={handleClickOutside}
                className={`w-full px-4 rounded-2xl flex flex-col justify-center items-center transition-all duration-500 ${searchBarActive ? 'h-[20vh]' : 'h-12'}`}
            >

                {searchBarActive && (
                    <div className="mt-1 mb-3  w-[40%] flex justify-between  text-center">
                        <button className="w-full py-2 font-bold text-gray-900 hover:text-pink-500 transition-colors">
                            Stays
                        </button>
                        <button className="w-full py-2 font-bold text-gray-900 hover:text-pink-500 transition-colors">
                            Nearby Places
                        </button>
                    </div>
                )}


                {searchBarActive ? (

                    <div className="  exclude-class bg-gray-200  h-[70px] flex flex-row items-center justify-between border rounded-full">
                        <div className="w-full">
                            <div className="flex flex-row items-center justify-between">

                                {}
                                <div
                                    onClick={() => setSearchModal('location')}
                                    className={`cursor-pointer w-[200px] h-[54px] px-8 m-2 flex flex-col justify-center rounded-full hover:bg-opacity-70 ${searchModal === 'location'
                                        ? 'bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white'
                                        : 'hover:bg-[#ffffff] hover:bg-opacity-80 '
                                        }`}
                                >
                                    <p className="text-xs font-semibold">Where</p>
                                    <div className='exclude-class'>
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={handleLocSearch}
                                            placeholder="Enter a location"
                                            className="border-none bg-transparent outline-none text-black text-sm"
                                        />
                                    </div>
                                </div>
                                {searchModal === "location" && (
                                    <div>
                                        {filteredLocations.length > 0 && (
                                            <div className="absolute top-[25vh] left-[25vw] mt-2 w-[300px] bg-white shadow-xl rounded-xl z-50 border border-gray-200">
                                                <div className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold">
                                                    Suggested Locations
                                                </div>
                                                {filteredLocations.map((location, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleSelectLocation(location)}
                                                        className="flex items-center gap-2 px-4 py-3 hover:bg-gray-200 cursor-pointer transition duration-200 ease-in-out"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="1.5"
                                                            stroke="currentColor"
                                                            className="w-5 h-5 text-gray-400"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 2.25c4.832 0 8.75 3.918 8.75 8.75 0 4.832-3.918 8.75-8.75 8.75-4.832 0-8.75-3.918-8.75-8.75 0-4.832 3.918-8.75 8.75-8.75z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M12 5.25v6l4.25 4.25"
                                                            />
                                                        </svg>
                                                        <span className="text-gray-800 text-sm font-medium">{location}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}


                                <div
                                    onClick={() => setSearchModal('checkin')}
                                    className={`cursor-pointer h-[54px] px-2 md:px-6 py-2 m-2 flex flex-col justify-center rounded-full ${searchModal === 'checkin'
                                        ? 'bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white'
                                        : 'hover:bg-[#ffffff] hover:bg-opacity-80'
                                        }`}
                                >
                                    <p className="text-xs font-semibold">Check in</p>
                                    <div className="flex flex-row items-center text-left text-[1rem] font-normal text-gray-400">
                                        {}
                                        {selectedDateRange[0].startDate ? (
                                            <>{format(selectedDateRange[0].startDate, 'LLL dd, y')}</>
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </div>
                                </div>

                                {}
                                <div
                                    onClick={() => setSearchModal('checkout')}
                                    className={`cursor-pointer h-[54px] px-2 md:px-6 py-2 m-2 flex flex-col justify-center rounded-full ${searchModal === 'checkout'
                                        ? 'bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white'
                                        : 'hover:bg-[#ffffff] hover:bg-opacity-90'
                                        }`}
                                >
                                    <p className="text-xs font-semibold">Check out</p>
                                    <div className="flex flex-row items-center text-left text-[1rem] font-normal text-gray-400">
                                        {selectedDateRange[0].endDate ? (
                                            <>{format(selectedDateRange[0].endDate, 'LLL dd, y')}</>
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                    </div>
                                </div>

                                {}
                                {(searchModal === 'checkout' || searchModal == "checkin") && (
                                    <div className="absolute top-[25vh] right-[20vw] border-[1px] mt-5 p-3 bg-white rounded-3xl flex justify-center">
                                        <DateRange
                                            rangeColors={['#f1424297']}
                                            ranges={selectedDateRange}
                                            date={new Date()}
                                            onChange={onSelectDate}
                                            direction="horizontal"
                                            showDateDisplay={false}
                                            minDate={new Date()}
                                            months={2}
                                            className="datepicker"
                                        />
                                    </div>
                                )}
                                {}

                                {}
                                <div
                                    onClick={() => setSearchModal('guests')}
                                    className={` cursor-pointer h-[48px] gap-[10px] lg:h-[54px] px-2 md:px-6 py-2 m-2 flex flex-row justify-around items-center rounded-full ${searchModal === 'guests'
                                        ? 'bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white'
                                        : 'hover:bg-[#ffffff] hover:bg-opacity-90'
                                        }`}
                                >
                                    <div onClick={() => setSearchModal('guests')}>
                                        <p className="text-xs w-full font-semibold">Who</p>
                                        <div className="w-full flex flex-col items-center justify-start text-left text-[1rem] font-normal text-gray-400">
                                            {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                                        </div>
                                    </div>

                                    {searchModal === 'guests' && (
                                        <div className="absolute top-[25vh] right-[20vw] border-[1px]   mt-5 p-4 rounded-3xl bg-white">
                                            {}
                                            <div className="mb-4 px-2 py-1 md:w-[400px] flex-row flex items-center justify-between border-gray-200">
                                                <div className="flex items-center flex-col justify-between mb-2">
                                                    <span className="text-gray-900 font-semibold text-lg w-full text-left">Adults</span>
                                                    {}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="p-3 rounded-full border border-gray-300"
                                                        onClick={() => decrementCount('adults')}
                                                    >
                                                        <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                    <span className="text-md font-medium text-gray-700">{adultsCount}</span>
                                                    <button
                                                        className="p-3 rounded-full border border-gray-300"
                                                        onClick={() => incrementCount('adults')}
                                                    >
                                                        <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {}
                                            <div className="mb-4 px-2 py-1 md:w-[400px] flex-row flex items-center justify-between border-gray-200">
                                                <div className="flex items-center flex-col justify-between mb-2">
                                                    <span className="text-gray-900 font-semibold text-lg w-full text-left">Children</span>
                                                    {}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="p-3 rounded-full border border-gray-300"
                                                        onClick={() => decrementCount('children')}
                                                    >
                                                        <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                    <span className="text-md font-medium text-gray-700">{childrenCount}</span>
                                                    <button
                                                        className="p-3 rounded-full border border-gray-300"
                                                        onClick={() => incrementCount('children')}
                                                    >
                                                        <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>

                                            {}
                                            <div className="px-2 py-1 md:w-[400px] flex-row flex items-center justify-between border-gray-200">
                                                <div className="flex items-center flex-col justify-between mb-2">
                                                    <span className="text-gray-900 font-semibold text-lg w-full text-left">Pets</span>
                                                    {}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="p-3 rounded-full border border-gray-300"
                                                        onClick={() => decrementCount('pets')}
                                                    >
                                                        <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                    <span className="text-md font-medium text-gray-700">{petsCount}</span>
                                                    <button
                                                        className="p-3 rounded-full border border-gray-300"
                                                        onClick={() => incrementCount('pets')}
                                                    >
                                                        <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        onClick={handleSearch}
                                        className="cursor-pointer h-[90%] my-auto px-4 flex items-center justify-center rounded-full gap- bg-pink-500"
                                    >
                                        <span className="text-white font-bold">Search</span>
                                        <FaSearch className="text-white w-4 h-4" />
                                    </div>
                                </div>

                                {}

                            </div>
                        </div>


                    </div>
                )

                    :
                    <div className="bg-white text-md flex justify-between items-center shadow-sm hover:shadow-md rounded-full py-2 transition-all duration-500 border w-full">
                        <div className="flex justify-center items-center cursor-pointer px-4 h-full border-r-2">
                            <div className="text-gray-900 font-semibold">{location}</div>
                        </div>
                        <div className="sm:flex justify-center items-center cursor-pointer px-4 h-full border-r-2">
                            <div className="text-gray-900 font-semibold">{`${checkInDates} - ${checkOutDates}`}</div>
                        </div>
                        <div className=" sm:flex justify-center items-center cursor-pointer px-4 h-full">
                            <div className="text-gray-900 font-semibold">
                                {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                            </div>

                        </div>
                        <div

                            className="flex items-center justify-center w-9 h-9 red-gradient text-white rounded-full mr-3">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                    </div>
                }

            </div>


        </div>



    );
}

