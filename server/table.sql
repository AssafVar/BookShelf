create table user (
    id int primary key auto_increment,
    name varchar(20) not null,
    contact_number varchar(20) not null,
    email varchar(250) not null,
    password varchar(255) not null,
    status varchar(20) not null,
    role varchar(20) not null,
    UNIQUE(email)
);

insert into user (name, contact_number, email, password, status, role) values 
                ('Admin', '033333333', 'admin@gmail.com', '1234', 'true', 'admin');