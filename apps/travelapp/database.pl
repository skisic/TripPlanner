:- use_module(library(persistency)).

:- persistent
        user(name:atom, pass:atom, role:oneof([regular,administrator])),
        user_list(username:atom, listName:atom),
        trip_activity(username:atom, listName:atom, city:atom, activityName:atom).

:- initialization(db_attach('userdb.journal', [])).

user('admin', 'pass', 'administrator').

user_list('sara','test').
user_list('sara','test2').

trip_activity('sara', 'test', 'Varazdin', 'B&B Arbia Dorka').
trip_activity('sara', 'test', 'Varazdin', 'My Way').

register_user(Username, Password) :- not(user(Username, _, _)) -> assert_user(Username, Password, regular), pengine_output("Registration successful!"); pengine_output("Username already exists!").
unregister_user(Username, Password) :- user(Username,_,_) -> retract_user(Username, Password, regular), pengine_output("Unregistration successful!"); pengine_output("User doesn't exist.").

login(Username, Password) :- user(Username, Password, _).

add_list(Username, ListName) :- not(user_list(Username, ListName)) -> assert_user_list(Username, ListName); pengine_output("List name already exists!").
remove_list(Username, ListName) :- retract_user_list(Username, ListName), retractall(trip_activity(Username, ListName, _, _)).

add_activity(Username, ListName, City, Activity):- not(trip_activity(Username, ListName, City, Activity)) -> assert_trip_activity(Username, ListName, City, Activity); pengine_output("Activity already added to the list").
remove_activity(Username, ListName, City, Activity):- retract_trip_activity(Username, ListName, City, Activity).

