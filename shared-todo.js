Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Template.body.helpers({
        tasks: function(){
            return Tasks.find({});
        }
    });
    Template.body.events({
        "submit .new-task": function(event){
            //prevent default browser submit
            event.preventDefault();

            //get valute from form element
            var text = event.target.text.value;
            var points = event.target.number.value;

            // insert task
            Tasks.insert({
                text: text,
                points: points,
                createdAt: new Date()
            });

            // clear form
            event.target.text.value = "";
            event.target.number.value = "";
        }
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
