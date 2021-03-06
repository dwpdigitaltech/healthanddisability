
module.exports = function(versionNumber, reviewCustomers, assessmentCustomers, appointmentCustomers){


	return [{
		url:"referrals",
		label:"Referrals", 
		quantity: 49,
		subItems: [{
			url: "new-referrals",
			label: "New referrals",
			quantity: 32
		},{
			url: "uc50-posted",
			label: "UC50 posted",
			quantity: 9
		},{
			url: "uc50-received",
			label: "UC50 received",
			quantity: 8
		}]
	},{
		url:"review",
		label:"Reviews", 
		quantity: reviewCustomers.length,
		subItems: [{
			url: "ready-for-review",
			label: "Ready for review",
			quantity: reviewCustomers.filter(customer => customer.status === "review").length
		},{
			url: "requested-medical-evidence",
			label: "Requested medical evidence",
			quantity: reviewCustomers.filter(customer => customer.status === "fme").length
			
		}]
	},{
		url:"appointments",
		label:"Appointments", 
		quantity: appointmentCustomers.length,
		subItems: [{
			url: "ready-to-book",
			label: "Ready to book",
			quantity:appointmentCustomers.filter(customer => customer.status === "Ready to book").length
		},{
			url: "booked-appointments",
			label: "Booked appointments",
			quantity: appointmentCustomers.filter(customer => customer.status === "Booked").length
		}
	    ,{
			url: "did-not-attend",
			label: "Did not attend",
			quantity: appointmentCustomers.filter(customer => customer.status === "Did not attend").length
		}]
	},{
		url:"assessment",
		label:"Today's appointments", 
		quantity:  assessmentCustomers.length,
		subItems: [{
			url: "todays-appointments",
			label: "Confirm arrival",
			quantity: assessmentCustomers.filter(customer => customer.status === "Appointment today").length
		},
		{
			url: "ready-for-assessment",
			label: "Ready for assessment",
			quantity: assessmentCustomers.filter(customer => customer.status === "Ready for assessment").length
		},
		{
			url: "assessment-stopped",
			label: "Assessment stopped",
			quantity: assessmentCustomers.filter(customer => customer.status === "Assessment stopped").length
		},
		{
			url: "completed-assessments",
			label: "Assessments completed",
			quantity: assessmentCustomers.filter(customer => customer.status === "Assessment completed").length
			
		}]

	}]
}