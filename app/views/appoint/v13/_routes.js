var express = require('express')
var router = express.Router()
var path = require('path')
var request = require('request')
var tog = require('../../../../lib/tog.js')
var staffDataHoliday = require('../../../../app/views/appoint/v13/staff-data-holiday.js')
var staffData2 = require('../../../../app/views/appoint/v13/staff-data-2.js')
var slotsData = require('../../../../app/views/appoint/v13/slots-data.js')
var slotsData2 = require('../../../../app/views/appoint/v13/slots-data-2.js')
var moment = require('moment')
var commentsData = require('../../../../app/views/appoint/v13/data/comments.js');
var calendar = require('node-calendar');
var appointmentHistoy = require('../../../../app/views/appoint/v13/data/appointmentHistory.js');



var arrivedTime = "";

var getAppointmentDates = function(){
  var appointments = {}

  appointments.nextAvailable = moment().add(15, 'days').hours(11).minutes(0);
  appointments.today = moment().hours(14).minutes(0);

  return appointments;
}


router.get('*', function (req, res, next) {
  // path is only available with the proper value within this sub-module/router.
  res.locals.path = req.baseUrl.substr(1)
  // create some other useful path variables.
  var bits = req.params[0].substr(1).split('/')
  res.locals.root = "/appoint/v13"
  res.locals.manageStaffPath = "appoint/v13/capacity/manage-staff"
  res.locals.path1 = res.locals.path + "/" + bits[0]
  res.locals.path2 = res.locals.path + "/" + bits[0] + "/" + bits[1]
  res.locals.stage = req.cookies.stage || 1;
  res.locals.query = req.query;
  res.locals.arrivedTime = arrivedTime;

  //res.locals.staff = staffData;
  res.locals.appointments = getAppointmentDates();


  next()
})

router.post('*', function (req, res, next) {
  // path is only available with the proper value within this sub-module/router.
  res.locals.path = req.baseUrl.substr(1)
  // create some other useful path variables.
  var bits = req.params[0].substr(1).split('/')
  res.locals.root = "/appoint/v13"
  res.locals.manageStaffPath = "appoint/v13/capacity/manage-staff"
  res.locals.path1 = res.locals.path + "/" + bits[0]
  res.locals.path2 = res.locals.path + "/" + bits[0] + "/" + bits[1]
  res.locals.stage = req.cookies.stage || 1;
  res.locals.query = req.query;
  res.locals.arrivedTime = arrivedTime;
  //res.locals.staff = staffData;
  next()
})





router.get('/booking/mendez*', function(req, res, next){

})
router.post('/booking/cancel-appointment', function(req, res, next){
  
    if(req.body.change_now === "true"){
      res.redirect('timepicker')
    } else {
      res.redirect('/appoint/v13/appointments-changed?reason=' + req.body.reason)
    }

  })


function getCentreDetails(req, res){
  var centres = require('../../../../app/views/appoint/v13/data/centres.js'),
        centreId = req.params.centreId;

  if(centreId){
      res.locals.centre = centres[centreId];
      res.locals.centre.id = centreId;
  } else {
    res.locals.centre = centres["fiveways"];
    res.locals.centre.id = "fiveways";

  }
};

router.get('/assessment-centres', function(req, res, next){
  res.locals.centres = require('../../../../app/views/appoint/v13/data/centres.js')
  next()
})

router.get('/appointments', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/referrals.js')
  if(req.query.booked){
    customers = customers.filter(customer => customer._id !== req.query.booked);
  }
  res.locals.customers = customers;
  next()
})

router.get('/booked_appointments', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/booked.js');
  res.locals.customers = customers.map(customer => {

    var arrivedTime = moment(customer.appointmentTime, "h:mma");
    customer.timeArrived = arrivedTime.add(customer.arrivedTime, "minutes").format("h:mma");

    return customer;
  })
  next()
})

router.get('/booking/history', function(req, res, next){
    res.locals.comments = commentsData
    next()
  })

router.post('/booking/history', function(req, res, next){
    var time = new Date();
    res.locals.comments = commentsData


      res.locals.comments.push({
        comment: req.body.comment,
        timestamp: time.getTime(),
        dateFormatted: moment(time).format("dddd DD MMM YYYY hh:mm a"),
        name: "Shelia Hopper",
        hasComment: true,
        isCustomer: true
        })
      res.render("appoint/v13/booking/history");

  })
router.post('/booking/cancel-appointment', function(req, res, next){
    if(req.body.change_now === "true"){
      res.redirect('timepicker')
    } else {
      res.redirect('/appoint/v13/appointments-changed?reason=' + req.body.reason)
    }

  })



router.post('/booking/bobby_timeline', function(req, res, next){
    var time = new Date();
    commentsData.push({
        timestamp: time.getTime(),
        dateFormatted: moment(time).format("dddd DD MMM YYYY hh:mm a"),
        name: "Shelia Hopper",
        hasComment: false,
        isCustomer: req.body.caller === "customer",
        authenticated: req.body.confirmed
        })
      res.render("appoint/v13/booking/bobby_timeline");

  })

router.get('/assessment-centres', function(req, res, next){
  res.locals.centres = require('../../../../app/views/appoint/v13/data/centres.js')
  next()
})




router.get('/decision_maker', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/decisionMaker.js');
  res.locals.customers = customers.map(customer => {

    var arrivedTime = moment(customer.appointmentTime, "h:mma");
    customer.timeArrived = arrivedTime.add(customer.arrivedTime, "minutes").format("h:mma");

    return customer;
  })
  next()
})

router.get('/todays_appointments', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/todaysAppointments.js');
  res.locals.customers = customers.map(customer => {

    var arrivedTime = moment(customer.appointmentTime, "h:mma");
    customer.timeArrived = arrivedTime.add(customer.arrivedTime, "minutes").format("h:mma");
    
    return customer;
  })

 
  next()
})

router.get('/booking/referrals/:customerId*', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/referrals.js');

  res.locals.section = "referrals";
  res.locals.templatePath = res.locals.path+"/booking/_layout.html";
  res.locals.customer = customers.filter(customer => customer._id === req.params.customerId)[0];
  next()
})



router.get('/booking/booked/:customerId/appointment-history', function(req, res, next){

  res.locals.history = appointmentHistoy.filter(entry => entry._id == req.params.customerId)[0];
  next()
})

router.get('/booking/referrals/:customerId', function(req, res, next){
  res.render("appoint/v13/booking/customer-referral");
})

router.get('/booking/booked/:customerId*', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/booked.js').concat(require('../../../../app/views/appoint/v13/data/todaysAppointments.js'));

  res.locals.section = "booked";
  res.locals.templatePath = res.locals.path+"/booking/_layout-booking.html";

  res.locals.customer = customers.filter(customer => customer._id === req.params.customerId)[0];
  next()
})

router.get('/booking/booked/:customerId/appointment-history', function(req, res, next){

  res.locals.history = appointmentHistoy.filter(entry => entry._id === req.params.customerId);
  next()
})

router.get('/booking/decision/:customerId/appointment-history', function(req, res, next){

  res.locals.history = appointmentHistoy.filter(entry => entry._id === req.params.customerId);
  next()
})





router.post('/booking/booked/:customerId*', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/booked.js');
  var todaysCustomers = require('../../../../app/views/appoint/v13/data/todaysAppointments.js');
  customers.concat(todaysCustomers);

  res.locals.section = "booked";
  res.locals.templatePath = res.locals.path+"/booking/_layout-booking.html";

  res.locals.customer = customers.filter(customer => customer._id === req.params.customerId)[0];
  next()
})
router.get('/booking/booked/:customerId', function(req, res, next){
  res.render("appoint/v13/booking/customer-booked");
})




router.get('/booking/decision/:customerId*', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/decisionMaker.js');

  res.locals.section = "decision";
  res.locals.templatePath = res.locals.path+"/booking/_layout-decision.html";
  res.locals.customer = customers.filter(customer => customer._id === req.params.customerId)[0];
  next()
})

router.post('/booking/decision/:customerId*', function(req, res, next){
  var customers = require('../../../../app/views/appoint/v13/data/decisionMaker.js');

  res.locals.section = "decision";
  res.locals.templatePath = res.locals.path+"/booking/_layout-decision.html";
  res.locals.customer = customers.filter(customer => customer._id === req.params.customerId)[0];
  next()
})

router.get('/booking/decision/:customerId', function(req, res, next){
  res.render("appoint/v13/booking/customer-booked");
})

router.get('/booking/decision/:customerId/details', function(req, res, next){
  res.render("appoint/v13/booking/details/contact");
})

router.get('/booking/decision/:customerId/illness', function(req, res, next){
  res.render("appoint/v13/booking/details/illness");
})

router.get('/booking/decision/:customerId/gp', function(req, res, next){
  res.render("appoint/v13/booking/details/gp");
})

router.get('/booking/decision/:customerId/details', function(req, res, next){
  res.render("appoint/v13/booking/details/contact");
})

router.get('/booking/decision/:customerId/timeline', function(req, res, next){
  res.render("appoint/v13/booking/timeline");
})

router.get('/booking/decision/:customerId/evidence', function(req, res, next){
  res.render("appoint/v13/booking/evidence/index");
})


router.get('/booking/decision/:customerId/evidence/:page', function(req, res, next){
  res.render("appoint/v13/booking/evidence/" + req.params.page);
})





router.get('/booking/decision/:customerId/:page', function(req, res, next){

  res.render("appoint/v13/booking/" + req.params.page);
})

router.post('/booking/booked/:customerId/request-rearrangement-post', function(req, res, next){  
  
  var changedByCustomer = req.body.changedByCustomer === 'yes' || false;

  if(req.body.changedByCustomer === 'no'){
    appointmentHistoy.push({
      _id: req.params.customerId,
      title: "Appointment re-arranged",
      entryDate: moment(new Date()).format(),
      comments: req.body.comments,
      appointmentDate: req.body.appointment,
      changedByCustomer: changedByCustomer
    });
    res.redirect(301, 'timepicker?reasonNeeded=false');
  } else {
    appointmentHistoy.push({
      _id: req.params.customerId,
      title: "Re-arrangment requested",
      entryDate: moment(new Date()).format(),
      comments: req.body.comments,
      appointmentDate: req.body.appointment,
      changedByCustomer: changedByCustomer
    });
    res.redirect(307, 'appointment-history');
  }
});

router.post('/booking/booked/:customerId/rearrange-reason-post', function(req, res, next){
  var changedByCustomer = req.body.changedByCustomer === 'yes' || false;

  if(changedByCustomer){
    res.locals.customer.ableToRearrange = false;
  }

  appointmentHistoy.push({
      _id: req.params.customerId,
      title: "Appointment re-arranged",
      entryDate: moment(new Date()).format(),
      comments: req.body.comments,
      appointmentDate: req.body.appointment,
      changedByCustomer: changedByCustomer
    });


  res.redirect(301, 'appointment-history');

});


router.post('/booking/decision/:customerId/decision-post', function(req, res, next){
  var title = `${res.locals.customer.decisionType} ${req.body.decision}`;
  console.log(title);
  appointmentHistoy.push({
      _id: req.params.customerId,
      title: title,
      entryDate: moment(new Date()).format(),
    });

  res.locals.customer.decisionMade = req.body.decision;
  res.redirect(307, 'appointment-history');

});


router.post('/booking/booked/:customerId/send-home-post', function(req, res, next){
  var comments = req.body.otherReason || req.body.reason;
  appointmentHistoy.push({
      _id: req.params.customerId,
      title: "Sent home unseen",
      entryDate: moment(new Date()).format(),
      comments: comments
    });


  res.redirect(301, 'timepicker?reasonNeeded=false');

});

router.post('/booking/booked/:customerId/timepicker-post', function(req, res, next){
    var changedByCustomer = req.body.changedByCustomer === 'yes' || false;

    if(req.body.reasonNeeded == 'false'){

      appointmentHistoy.push({
        _id: req.params.customerId,
        title: "Appointment booked",
        entryDate: moment(new Date()).format(),
        comments: req.body.comments,
        appointmentDate: moment(req.body.appointment).format(),
        changedByCustomer: changedByCustomer
      });
      res.redirect(302, 'appointment-history');
    } 
    else {
      req.session.appointmentDate = req.body.appointment,

      res.redirect(302, 'rearrange-reason?appointment=' + moment(req.body.appointment).format('YYYY MM DD hh:mm'));
    }
  })



router.get('/booking/referrals/:customerId/gp', function(req, res, next){
  res.render("appoint/v13/booking/details/gp");
})

router.get('/booking/referrals/:customerId/illness', function(req, res, next){
  res.render("appoint/v13/booking/details/illness");
})

router.get('/booking/referrals/:customerId/details', function(req, res, next){
  res.render("appoint/v13/booking/details/contact");
})

router.get('/booking/referrals/:customerId/timeline', function(req, res, next){
  res.render("appoint/v13/booking/timeline");
})

router.get('/booking/referrals/:customerId/appointment-history', function(req, res, next){
  res.render("appoint/v13/booking/appointment-history");
})

router.get('/booking/referrals/:customerId/evidence', function(req, res, next){
  res.render("appoint/v13/booking/evidence/index");
})


router.get('/booking/referrals/:customerId/evidence/:page', function(req, res, next){
  res.render("appoint/v13/booking/evidence/" + req.params.page);
})


router.get('/booking/booked/:customerId/evidence/:page', function(req, res, next){
  res.render("appoint/v13/booking/evidence/" + req.params.page);
})

router.get('/booking/booked/:customerId/illness', function(req, res, next){
  res.render("appoint/v13/booking/details/illness");
})



router.get('/booking/booked/:customerId/gp', function(req, res, next){
  res.render("appoint/v13/booking/details/gp");
})

router.get('/booking/booked/:customerId/arrived', function(req, res, next){
  var appointmentTime = moment(res.locals.customer.appointmentTime, "h:mma");
  res.locals.customer.timeArrived = appointmentTime.add(res.locals.customer.arrivedTime, "minutes").format("h:mma");
  res.render("appoint/v13/booking/details/arrived");
})
router.get('/booking/booked/:customerId/today', function(req, res, next){
  res.render("appoint/v13/booking/details/today");
})
router.get('/booking/booked/:customerId/send-home', function(req, res, next){
  var appointmentTime = moment(res.locals.customer.appointmentTime, "h:mma");
  res.locals.customer.timeArrived = appointmentTime.add(res.locals.customer.arrivedTime, "minutes").format("h:mma");
  next()
})



router.get('/booking/booked/:customerId/details', function(req, res, next){
  res.render("appoint/v13/booking/details/contact");
})

router.get('/booking/booked/:customerId/timeline', function(req, res, next){
  res.render("appoint/v13/booking/timeline_booked");
})

router.post('/booking/booked/mendez/mendez_timeline-arrived', function(req, res, next){

    res.locals.arrivedTimeMoment = moment(new Date());;
    arrivedTime = res.locals.arrivedTimeMoment.format("h:mm a");
    res.locals.arrivedTime = arrivedTime;

    res.render("appoint/v13/booking/mendez_timeline-arrived");
  })

router.post('/booking/booked/:customerId/timeline-arrived', function(req, res, next){
    var customers = require('../../../../app/views/appoint/v13/data/booked.js');
    res.locals.customer = customers.filter(customer => customer._id === req.params.customerId)[0];
  
    var arrivedTimeMoment = moment(new Date());;
    res.locals.customer.timeArrived = arrivedTimeMoment.format("h:mm a");


    res.render("appoint/v13/booking/timeline-arrived");
  })




router.get('/booking/booked/mendez/*', function(req, res, next){

    var startTime = moment(res.locals.arrivedTime, 'hh:mma');
    var endTime = moment(new Date(), 'hh:mm:ss a');

    var totalHours = (endTime.diff(startTime, 'hours'));
    var totalMinutes = endTime.diff(startTime, 'minutes');
    var clearMinutes = totalMinutes % 60;
    res.locals.waitTime = totalMinutes //totalHours + " hours and " + clearMinutes + " minutes";
    next()
  })

router.get('*/timepicker', function(req, res, next){
  var availableAppointments = require('../../../../app/views/appoint/v13/data/availableAppointments.js');
  
  if(!res.locals.query.number){
    res.locals.query.number = 4;
  }
  res.locals.availableAppointments = availableAppointments.filter(appointment => moment(appointment.appointmentDate).day() > 0 && moment(appointment.appointmentDate).day() < 6);
  res.locals.newNumber = parseInt(res.locals.query.number) + 4;
  next()
})

router.get('*/send-home-2', function(req, res, next){
  var availableAppointments = require('../../../../app/views/appoint/v13/data/availableAppointments.js');
  
  if(!res.locals.query.number){
    res.locals.query.number = 4;
  }
  res.locals.availableAppointments = availableAppointments.filter(appointment => moment(appointment.appointmentDate).day() > 0 && moment(appointment.appointmentDate).day() < 6);
  res.locals.newNumber = parseInt(res.locals.query.number) + 4;
  next()
})


router.post('/booking/booked/:customerId/send-home-2', function(req, res, next){
  res.locals.postData = req.body;
  var reason = req.body.otherReason || req.body.reason;
  appointmentHistoy.push({
    _id: req.params.customerId,
    title: "Sent home unseen",
    comments: reason,
    entryDate: moment(new Date()).format(),
    appointmentDate: null,
    changedByCustomer: false
  });

  next()
})

router.get('/booking/booked/:customerId/evidence', function(req, res, next){
  res.render("appoint/v13/booking/evidence/index");
})


router.get('/booking/booked/:customerId/:pageName', function(req, res, next){
  res.render("appoint/v13/booking/" + req.params.pageName);
})


router.get('/capacity/manage-centre/:centreId*', function(req, res, next){
  getCentreDetails(req, res)
  res.locals.staff = require('../../../../app/views/appoint/v13/data/staff.js')
  next()
})

router.post('/capacity/manage-centre/:centreId*', function(req, res, next){
  getCentreDetails(req, res)
  res.locals.staff = require('../../../../app/views/appoint/v13/data/staff.js')
  next()
})


router.get('/capacity/manage-centre/:centreId', function(req, res, next){
  res.render("appoint/v13/capacity/manage-centre/index")
})

router.get('/capacity/manage-centre/:centreId/:section*', function(req, res, next){
  res.locals.selectedTab = req.params.section;
  next()
})

router.post('/capacity/manage-centre/:centreId/:section*', function(req, res, next){
  res.locals.selectedTab = req.params.section;
  next()
})

router.get('/capacity/manage-centre/:centreId/manage-staff', function(req, res, next){
    res.locals.staffTotals = {};
    res.locals.staffTotals.complex = res.locals.staff.filter(staff => staff.skill === "Complex Neuro").length;
    res.locals.staffTotals.neuro = res.locals.staff.filter(staff => staff.skill === "Neuro").length;;
    res.locals.staffTotals.standard = res.locals.staff.filter(staff => staff.skill === "Standard").length;
    res.locals.staffTotals.scrutiny = res.locals.staff.filter(staff => staff.scrutinyPaperwork).length;
    res.locals.staffTotals.total = res.locals.staff.length;

  //
  res.render("appoint/v13/capacity/manage-staff/index");
})



router.get('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId*', function(req, res, next){
  var staff = require('../../../../app/views/appoint/v13/data/staff.js');

  res.locals.person = staff.filter(person => person.id === req.params.staffId)[0];
  var today = moment();
  var year = today.year();
  if(req.query.month == "next"){
    var month = today.month() + 2;
  } else {
    var month = today.month() + 1;
  }
  res.locals.calendaDate = moment().month(month -1).year(year);
  res.locals.calendar  = new calendar.Calendar(0).monthdatescalendar(year, month);
  res.locals.today = today.format();
  next()
})

router.post('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId*', function(req, res, next){
  var staff = require('../../../../app/views/appoint/v13/data/staff.js');

  res.locals.person = staff.filter(person => person.id === req.params.staffId)[0];
  var today = moment(new Date(2018,8,9));
  var year = today.year()
  var month = today.month() + 1;
  res.locals.calendar  = new calendar.Calendar(0).monthdatescalendar(2018, 8);
  res.locals.today = today.format();
  next()
})

router.post('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId/staff-availability-2', function(req, res, next){
  res.locals.formData = req.body;
  res.render("appoint/v13/capacity/manage-staff/staff-availability-2");
  })

router.post('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId/staff-profile-2', function(req, res, next){
  
  res.locals.formData = req.body;
  
  res.render("appoint/v13/capacity/manage-staff/staff-profile-2");
  })


router.get('/capacity/manage-centre/:centreId/capacity-overbooked', function(req, res, next){

  res.locals.staff = require('../../../../app/views/appoint/v13/data/staff-overbooked.js');

  next();
}) 



router.get('/capacity/manage-centre/:centreId', function(req, res, next){
  res.render("appoint/v13/capacity/manage-centre/index")
})

router.get('/capacity/manage-centre/:centreId/:section*', function(req, res, next){
  res.locals.selectedTab = req.params.section;
  next()
})

router.get('/capacity/manage-centre/:centreId/manage-staff', function(req, res, next){
    res.locals.staffTotals = {};
    res.locals.staffTotals.complex = res.locals.staff.filter(staff => staff.skill === "Complex Neuro").length;
    res.locals.staffTotals.neuro = res.locals.staff.filter(staff => staff.skill === "Neuro").length;;
    res.locals.staffTotals.standard = res.locals.staff.filter(staff => staff.skill === "Standard").length;
    res.locals.staffTotals.scrutiny = res.locals.staff.filter(staff => staff.scrutinyPaperwork).length;
    res.locals.staffTotals.total = res.locals.staff.length;

  //
  res.render("appoint/v13/capacity/manage-staff/index");
})




router.get('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId*', function(req, res, next){
  var staff = require('../../../../app/views/appoint/v13/data/staff.js');

  res.locals.person = staff.filter(person => person.id === req.params.staffId)[0];
  next()
})


router.get('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId', function(req, res, next){
  res.render("appoint/v13/capacity/manage-staff/staff-profile");
})

router.get('/capacity/manage-centre/:centreId/manage-staff/staff-profile/:staffId/:section', function(req, res, next){
  res.render("appoint/v13/capacity/manage-staff/" + req.params.section);
})

router.get('/capacity/manage-centre/:centreId/capacity-overbooked', function(req, res, next){

  res.locals.staff = require('../../../../app/views/appoint/v13/data/staff-overbooked.js');

  next();
})  

router.get('/capacity/manage-centre/:centreId/capacity*', function(req, res, next){
  res.locals.selectedTab = "capacity";

  res.locals.staffTotals = {}
  res.locals.staffTotals.available = res.locals.staff.filter(function(obj){
    if(obj.scrutinyPaperwork && obj.days[req.query.day].scrutiny){
      return false;
    } else {
      return obj.days[req.query.day].available
    }
  }).length;

  var totalAppointments = 0;

  slotsData[req.query.day].map(day => totalAppointments = totalAppointments + day.usedSlots);
  res.locals.totalAppointments = totalAppointments;
  res.locals.slots = slotsData[req.query.day];
  res.locals.totalSlots = slotsData[req.query.day].length;

  res.locals.totalAvailableAppointments = res.locals.staffTotals.available * res.locals.totalSlots;
  res.render("appoint/v13/capacity/manage-centre/capacity");
})

router.get('/capacity/manage-centre/:centreId/details', function(req, res, next){
  res.render("appoint/v13/capacity/manage-centre/index")
})

router.get('/capacity/manage-centre/:centreId/slots', function(req, res, next){
  res.render("appoint/v13/capacity/manage-centre/index")
})
router.get('/capacity/manage-centre/:centreId/rooms', function(req, res, next){
  res.render("appoint/v13/capacity/manage-centre/index")
})

router.get('/capacity/manage-centre/:centreId/:section', function(req, res, next){
  res.render("appoint/v13/capacity/manage-centre/" + req.params.section)
})

router.post('/capacity/manage-centre/:centreId/manage-staff/new-staff-skill', function(req, res, next){
  res.locals.person = {
    name: req.body.name,
    phone: req.body.phone,
    mobile: req.body.mobile,
    email: req.body.email
  }
  res.render("appoint/v13/capacity/manage-staff/new-staff-skill");
});

router.post('/capacity/manage-centre/:centreId/manage-staff/new-staff-hours', function(req, res, next){
  res.locals.person = {
    name: req.body.name,
    phone: req.body.phone,
    mobile: req.body.mobile,
    email: req.body.email,
    scrutiny: req.body.scrutiny,
    skill: req.body.skill 
  } ; 
  res.render("appoint/v13/capacity/manage-staff/new-staff-hours");
});

router.post('/assessment-centres', function(req, res, next){
  res.locals.centres = require('../../../../app/views/appoint/v13/data/centres.js')
  var centre = {
    name: req.body.name,
    location: req.body.location
  };
  res.locals.centres[centre.name] = centre; 
  res.render("appoint/v13/assessment-centres");
});

router.post('/capacity/new-centre-2', function(req, res, next){
  res.locals.centre = {
    name: req.body.name,
    location: req.body.location
  } ; 
  res.render("appoint/v13/capacity/new-centre-2");
});

router.post('/capacity/new-centre-3', function(req, res, next){
  res.locals.centre = {
    name: req.body.name,
    location: req.body.location
  } ; 
  res.render("appoint/v13/capacity/new-centre-3");
});




router.post('/capacity/manage-centre/:centreId/manage-staff/', function(req, res, next){
  var scrutiny = req.body.scrutiny === "true";
  res.locals.person = {
    name: req.body.name,
    phone: req.body.phone,
    mobile: req.body.mobile,
    email: req.body.email,
    scrutinyPaperwork: scrutiny,
    skill: req.body.skill 
  }; 
  res.locals.staff.push(res.locals.person)
  res.locals.query.tab = "staff";

  res.locals.staffTotals = {};
    res.locals.staffTotals.complex = res.locals.staff.filter(staff => staff.skill === "Complex Neuro").length;
    res.locals.staffTotals.neuro = res.locals.staff.filter(staff => staff.skill === "Neuro").length;;
    res.locals.staffTotals.standard = res.locals.staff.filter(staff => staff.skill === "Standard").length;
    res.locals.staffTotals.scrutiny = res.locals.staff.filter(staff => staff.scrutinyPaperwork).length;
    res.locals.staffTotals.total = res.locals.staff.length;

  res.render("appoint/v13/capacity/manage-staff/index");
});

router.get('/capacity/manage-centre/:centreId/manage-staff/:section', function(req, res, next){
  res.render("appoint/v13/capacity/manage-staff/" + req.params.section)
});

router.post('/capacity/manage-centre/:centreId/edit-centre-3', function(req, res, next){
  if(req.body["available-days-Saturday"] === "on"){
    res.locals.saturday = true;
  } else {
    res.locals.saturday = false;
  }
  res.render("appoint/v13/capacity/manage-centre/edit-centre-3");
})

router.post('/capacity/manage-centre/:centreId/details', function(req, res, next){
  res.locals.centre.details = req.body.details;
  if(req.body.saturday == "true"){
    res.locals.centre.openingTimes[5] = {
        "day": "Saturday",
        "open": "10:00am - 3:00pm"
      }
  } else {
    res.locals.centre.openingTimes[5] = {
        "day": "Saturday",
        "open": "Closed"
      }
  }
  res.render("appoint/v13/capacity/manage-centre/index");
})





router.get('/capacity/manage-centre/capacity', function(req, res, next){

  res.locals.staffTotals = {}
  res.locals.staffTotals.available = staffData.filter(function(obj){
    if(obj.scrutinyPaperwork && obj.days[req.query.day].scrutiny){
      return false;
    } else {
      return obj.days[req.query.day].available
    }
  }).length;

  var totalAppointments = 0;

  slotsData[req.query.day].map(day => totalAppointments = totalAppointments + day.usedSlots);
  res.locals.totalAppointments = totalAppointments;
  res.locals.slots = slotsData[req.query.day];
  res.locals.totalSlots = slotsData[req.query.day].length;

  res.locals.totalAvailableAppointments = res.locals.staffTotals.available * res.locals.totalSlots;
  
  next();
});


router.get('/capacity/manage-centre/capacity-edit-slots', function(req, res, next){

  res.locals.staffTotals = {}
  res.locals.staffTotals.available = staffData.filter(function(obj){
    if(obj.scrutinyPaperwork && obj.days[req.query.day].scrutiny){
      return false;
    } else {
      return obj.days[req.query.day].available
    }
  }).length;

  var totalAppointments = 0;

  slotsData[req.query.day].map(day => totalAppointments = totalAppointments + day.usedSlots);
  res.locals.totalAppointments = totalAppointments;
  res.locals.slots = slotsData[req.query.day];
  res.locals.totalSlots = slotsData[req.query.day].length;

  
  res.locals.totalAvailableAppointments = res.locals.staffTotals.available * res.locals.totalSlots;
  next();
});

router.get('/capacity/manage-centre/capacity-holiday', function(req, res, next){
  res.locals.staff = staffDataHoliday;
  res.locals.staffTotals = {}
  res.locals.staffTotals.available = staffDataHoliday.filter(function(obj){
    if(obj.scrutinyPaperwork && obj.days[req.query.day].scrutiny){
      return false;
    } else {
      return obj.days[req.query.day].available
    }
  }).length;

  var totalAppointments = 0;

  slotsData[req.query.day].map(day => totalAppointments = totalAppointments + day.usedSlots);
  res.locals.totalAppointments = totalAppointments;
  res.locals.slots = slotsData[req.query.day];
  res.locals.totalSlots = slotsData[req.query.day].length;
  
  res.locals.totalAvailableAppointments = res.locals.staffTotals.available * res.locals.totalSlots;
  
  next();
});

router.get('/capacity/manage-centre/capacity-2', function(req, res, next){
  res.locals.staff = staffData2;
  res.locals.staffTotals = {}
  res.locals.staffTotals.available = staffData2.filter(function(obj){
    if(obj.scrutinyPaperwork && obj.days[req.query.day].scrutiny){
      return false;
    } else {
      return obj.days[req.query.day].available
    }
  }).length;

  var totalAppointments = 0;

  slotsData2[req.query.day].map(day => totalAppointments = totalAppointments + day.usedSlots);
  res.locals.totalAppointments = totalAppointments;
  res.locals.slots = slotsData2[req.query.day];
  res.locals.totalSlots = slotsData2[req.query.day].length;

  if(req.query.day == "thursday"){
  res.locals.totalAvailableAppointments = res.locals.staffTotals.available * res.locals.totalSlots - 11;
  } else {
  res.locals.totalAvailableAppointments = res.locals.staffTotals.available * res.locals.totalSlots;
  }
  next();
});

router.get('/miarussell/*', function (req, res, next) {
  res.locals.firstname = "Mia"
  next()
})


router.get('/cookies/', function (req, res, next) {
  res.send(tog(req.cookies));
})

module.exports = router
