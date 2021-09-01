:- module(travelapp, 
	[  
	   get_activity_type/6,
	   get_city_img/2,
	   get_hotel_amenities/3,
	   get_hotel_info/7,
	   get_bar_restaurant_info/6,
	   get_activity_info/7,
	   get_bar_restaurant_services/2,
	   get_city_activity/3
	]).
:- include(database).
:- use_module(pengine_sandbox:library(pengines)).
:- use_module(library(semweb/rdf_db)).
:- use_module(pengine_sandbox:library(semweb/rdf_db)).
:- use_module(library(sandbox)).
:- use_module(pengine_sandbox:library(persistency)).
:- use_module(library(persistency)).
:- multifile sandbox:safe_primitive/1.
sandbox:safe_primitive(rdf_db:rdf(_,_,_)).
sandbox:safe_primitive(travelapp:register_user(_,_)).
sandbox:safe_primitive(travelapp:add_list(_,_)).
sandbox:safe_primitive(travelapp:remove_list(_,_)).
sandbox:safe_primitive(travelapp:add_activity(_,_,_,_)).
sandbox:safe_primitive(travelapp:remove_activity(_,_,_,_)).

path(X) :- absolute_file_name('croatia_travel2.owl', X, [mode(read)]).

?- path(X), rdf_load(X).
?- rdf_register_prefix(t,'http://www.semanticweb.org/sara/ontologies/2021/7/croatia_travel#').
?- rdf_register_prefix(schema,'http://schema.org/').

get_city_img(City, Image):- rdf(Name, rdf:type, t:'City'), 
						rdf(Name, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',City))),
						rdf(Name, schema:image, Image).
						
get_activity_type(ActivityName, TypeName, CityName, Image, Review, Price):- (rdf(Type, rdfs:subClassOf, t:'Activity');
						rdf(Type, rdfs:subClassOf, t:'Accommodation')),
						rdf(Activity, rdf:type, Type),
						rdf(Type, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',TypeName))),
						rdf(Activity, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',ActivityName))),
						rdf(City, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',CityName))),
						rdf(Activity, t:'isLocated', City),
						rdf(Activity, schema:image, Image),
						rdf(Activity, t:'Review', Review),
						rdf(Activity, t:'Price', Price).

get_city_activity(ActivityName, TypeName, CityName):- (rdf(Type, rdfs:subClassOf, t:'Activity');
						rdf(Type, rdfs:subClassOf, t:'Accommodation')),
						rdf(Activity, rdf:type, Type),
						rdf(Type, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',TypeName))),
						rdf(Activity, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',ActivityName))),
						rdf(City, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',CityName))),
						rdf(Activity, t:'isLocated', City).

get_hotel_amenities(HotelName, AmenityName, AmenityTypeName):- 
						(rdf(Accommodation, rdf:type, t:'Hotel');
						rdf(Accommodation, rdf:type, t:'Hostel')),
						rdf(Accommodation, t:hasAmenities, Amenity),
						rdf(Amenity, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',AmenityName))),
						rdf(Accommodation, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',HotelName))),
						rdf(Amenity, rdf:type, AmenityType),
						rdf(AmenityType, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',AmenityTypeName))).

get_hotel_info(HotelName, Description, Review, Price, Address, Phone, Website):-
						(rdf(Accommodation, rdf:type, t:'Hotel');
						rdf(Accommodation, rdf:type, t:'Hostel')),
						rdf(Accommodation, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',HotelName))),
						rdf(Accommodation, t:'Description', Description),
						rdf(Accommodation, t:'Review', Review),
						rdf(Accommodation, t:'Price', Price),
						rdf(Accommodation, t:'Address', Address),
						rdf(Accommodation, t:'Phone', Phone),
						rdf(Accommodation, t:'Website', Website).


get_bar_restaurant_info(ActivityName, Review, Price, Address, Phone, Website):-
						(rdf(Activity, rdf:type, t:'Bar');
						rdf(Activity, rdf:type, t:'Restaurant')),
						rdf(Activity, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',ActivityName))),
						rdf(Activity, t:'Review', Review),
						rdf(Activity, t:'Price', Price),
						rdf(Activity, t:'Address', Address),
						rdf(Activity, t:'Phone', Phone),
						rdf(Activity, t:'Website', Website).

get_activity_info(ActivityName, Description, Review, Price, Address, Phone, Website):-
						(rdf(Activity, rdf:type, t:'Beach');
						rdf(Activity, rdf:type, t:'Landmark');
						rdf(Activity, rdf:type, t:'Museum');
						rdf(Activity, rdf:type, t:'Sport');
						rdf(Activity, rdf:type, t:'Tour');
						rdf(Activity, rdf:type, t:'Cruise')),
						rdf(Activity, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',ActivityName))),
						rdf(Activity, t:'Description', Description),
						rdf(Activity, t:'Review', Review),
						rdf(Activity, t:'Price', Price),
						rdf(Activity, t:'Address', Address),
						rdf(Activity, t:'Phone', Phone),
						rdf(Activity, t:'Website', Website).

get_bar_restaurant_services(ActivityName, ServiceName):- 
						(rdf(Activity, rdf:type, t:'Bar');
						rdf(Activity, rdf:type, t:'Restaurant')),
						rdf(Activity, t:hasServices, Service),
						rdf(Service, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',ServiceName))),
						rdf(Activity, rdfs:label, literal(type('http://www.w3.org/2001/XMLSchema#string',ActivityName))).
