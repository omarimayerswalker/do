Tasks = new Mongo.Collection("tasks");
Totals = new Mongo.Collection("totals");

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
        },
        usernames: function(){
            var allusers = Meteor.users.find();
            return allusers;
        },

        totalsAll: function(){
            var distinctEntries = _.uniq(Totals.find({}, {
                sort: {totalPoints: 1}, fields: {totalPoints: true}
            }).fetch().map(function(x) {
                return x.totalPoints;
            }), true);

            var userTotal = 0;

            for(var i = 0; i < distinctEntries.length; i++){

                if (Number.isInteger(distinctEntries[i])){
                    userTotal = userTotal + distinctEntries[i];
                }
            }
            // console.log(userTotal);
            return userTotal;
        }
    });

    Template.body.events({
        "submit .new-task": function(event){
            //prevent default browser submit
            event.preventDefault();

            //get valute from form element
            var text = event.target.text.value;
            var points = parseInt(event.target.number.value);

            // insert task
            Tasks.insert({
                text: text,
                points: points,
                createdAt: new Date(),
                owner: Meteor.userId(),
                username: Meteor.user().username
            }),

            // update total points
            Totals.insert({
                owner: Meteor.userId(),
                username: Meteor.user().username,
                totalPoints: points
            });

            Totals.update(
                { _id: Meteor._id() },
                {
                    $inc: { totalPoints: points}
                }
            );

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

// if (Meteor.isServer) {
// }
