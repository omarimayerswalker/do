Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
    Template.body.helpers({
        tasks: function(){
            if (Session.get("hideCompleted")){
                // if hide completed, filter tasks
                return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
            } else {
                return Tasks.find({}, {sort: {createdAt: -1}});
            }
        },
        hideCompleted: function(){
            return Session.get("hideCompleted");
        },
        incompleteCount: function(){
            return Tasks.find({checked: {$ne: true}}).count();
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
                createdAt: new Date(),
                owner: Meteor.userId(),
                username: Meteor.user().username
            });

            // clear form
            event.target.text.value = "";
            event.target.number.value = "";
        },
        "change .hide-completed input": function(event){
            Session.set("hideCompleted", event.target.checked);
        }
    });

    Template.task.events({
        "click .toggle-checked": function(){
            Tasks.update(this._id, {
                $set: {checked: ! this.checked}
            });
        },
        "click .delete": function(){
            Tasks.remove(this._id);
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
