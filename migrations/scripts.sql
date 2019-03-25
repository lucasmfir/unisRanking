create table universities
(
	uni_id int auto_increment,
	uni_name varchar(254) not null,
	constraint universities_pk
		primary key (uni_id)
);




create table courses
(
	course_id int auto_increment,
	course_name varchar(254) not null,
	constraint courses_pk
		primary key (course_id)
);





create table grade
(
	grade_id int auto_increment,
	uni_id int not null,
	course_id int not null,
	constraint grade_pk
		primary key (grade_id),
	constraint grade_courses_course_id_fk
		foreign key (course_id) references courses (course_id),
	constraint grade_universities_uni_id_fk
		foreign key (uni_id) references universities (uni_id)
);




alter table grade
	add grade float not null;

