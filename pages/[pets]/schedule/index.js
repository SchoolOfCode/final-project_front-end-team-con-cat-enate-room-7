import React from "react";
import NavBar from "../../../Components/navBar.js";
import AddButton from "../../../Components/addButton.js";
import ScheduleCard from "../../../Components/scheduleCard";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid/non-secure";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Loader from "../../../Components/loader.js";
import InfoModal from "../../../Components/modal.js";
import NoDataCard from "../../../Components/noDataCard.js";


const url = process.env.NEXT_PUBLIC_DB_URL ?? "http://localhost:3000"


export async function getServerSideProps(context){
    const id = context.params.pets
  const response = await fetch(`${url}/pets?pet_id=${id}`)
    const data = await response.json()
   return {props:{pet:data.payload[0]}}
    }
  
export default withPageAuthRequired (function SchedulePage({pet}) {
  const [stateCount, setStateCount] = useState(0);
  const [data, setData] = useState();
  
	const delay = ms => new Promise(
		resolve => setTimeout(resolve, ms)
	  );
	useEffect(() => {

		const fetchData = async () => {
			await delay(500)
			const response = await fetch(`${url}/reminders?pet_id=${pet.pet_id}`);
			const data = await response.json();
			let newArray = data.payload.filter((object) => object.completed === false)
			setData(newArray);
		};

		fetchData().catch(console.error);
	}, []);

	useEffect(() => {

		const fetchData = async () => {
			const response = await fetch(`${url}/reminders?pet_id=${pet.pet_id}`);
			const data = await response.json();
			let newArray = data.payload.filter((object) => object.completed === false)
			setData(newArray);
		};

		fetchData().catch(console.error);
	}, [stateCount]);

	if (!data) {
		return <Loader/>;
	}

	async function patchFunction(data) {
		await fetch(`${url}/reminders/${data.reminder_id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ completed: true }),
		})
			.then((res) => res.json)
			.then((data))
			.then(() => {
				setStateCount((c) => c + 1);
			});
	}

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

	async function postFunction(data) {
		const dateString = data.date;
		const frequency = data.frequency;
		const numberFrequency = Number(frequency);
		const [year, month, day] = dateString.split("-" || "/");
    const numDay = Number(day);
    const numMonth = Number(month);
    const numYear = Number(year);
		const newDate = addDays(
			numberFrequency,
			new Date(`${numYear}/${numMonth}/${numDay}`)
		);
    const newDateString = [newDate.getFullYear(), padTo2Digits(newDate.getMonth() + 1), padTo2Digits(newDate.getDate())].join('-');
		await fetch(`${url}/reminders`, {
			method: "POST",
			body: JSON.stringify({
				user_id: data.user_id,
				pet_id: data.pet_id,
				reminder_id: nanoid(10),
				task: data.task,
				date: newDateString,
				completed: false,
				repeated: data.repeated,
				frequency: data.frequency,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	function onClick(data) {
		patchFunction(data);
		if(data.repeated){
			postFunction(data);
		}
	}

	function addDays(days, date = new Date()) {
		date.setDate(date.getDate() + days);

		return date;
	}

	async function onDelete(data) {
		await fetch(`${url}/reminders/${data.reminder_id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json)
			.then((data))
			.then(() => {
				setStateCount((c) => c + 1);
			});
	}



	return (
		<main>
			<NavBar pet={pet}/>
			<div className="m10">
			<InfoModal title="Schedule Page- Info" text="Welcome to your pet's Schedule Page. Here you can keep track of anything your pet needs during care. Start by pressing the Add Button (+) and filling out the form, after this you will be re-directed back to this page. Anytime you have done the reminder you have added simply press Done where the date will update to the next time you need to repeat this task and a log of what you have already done will be kept in the View History section."/>
				<h2 className="text-center">Check Schedule</h2>
			      <h2>{pet.name}</h2>
				{!data[0] && <NoDataCard text="You haven't added any reminders yet. Click the Add Button below to get started." />}
				{data
					.map((filteredData) => (
						<ScheduleCard
							key={filteredData.reminder_id}
							data={filteredData}
							onClick={onClick}
							onDelete={onDelete}
						/>
					))}
			</div>
			<AddButton text="Add Reminder" href={{pathname:`schedule/addReminder`, query:{pets:`${pet.pet_id}`}}} />
		</main>
	);
}
)