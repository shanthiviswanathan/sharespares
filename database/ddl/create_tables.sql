CREATE TABLE `loftu_members` (
  `member_id` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hash` varchar(255) NOT NULL,
  `salt` varchar(100) NOT NULL,
  `display_name` varchar(200) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `title` varchar(20) DEFAULT NULL,
  `status` varchar(10) DEFAULT 'ACTIVE',  
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `citystate` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `join_date` datetime DEFAULT NOW(),
  `leave_date` datetime DEFAULT NULL,
  `reset_password` BOOLEAN NOT NULL DEFAULT false,
  `security_question1` varchar(200) NOT NULL,
  `security_answer1` varchar(100) NOT NULL,
  `security_question2` varchar(200) NOT NULL,
  `security_answer2` varchar(100) NOT NULL,
  `thumbnail_image` tinyblob,
  `modified_date` datetime DEFAULT NULL,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `loftu_groups` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `status` varchar(10) DEFAULT 'ACTIVE',
  `visibility` varchar(10) DEFAULT 'PRIVATE',  
  `admin_id` varchar(255) NOT NULL,
  `location` varchar(45) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `member_limit` int DEFAULT NULL,
  `approval_process` varchar(45) DEFAULT NULL,
  `ask_signup_question` BOOLEAN DEFAULT FALSE,
  `rsvp_start_date` datetime  DEFAULT NULL,
  `rsvp_end_date` datetime  DEFAULT NULL,
  `modified_date` datetime DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  INDEX group_memberid (admin_id),
  FOREIGN KEY (admin_id) REFERENCES loftu_members(member_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

insert into loftu_members (member_id,email, hash, salt, display_name, 
citystate, country, security_question1, security_answer1, security_question2,
security_answer2, status)
 values ('fR7fqZg9TSePCJYjDB4NUqWmZAH2', 'shautfol@gmail.com', 'a55f42645a6cb888ed400bc993cdb77a868a45e6ef35a4ad3b67b18f515dbf674c5129fc19026fc44bc47c51aee5582ed793f8164f205641b197f73e67d8a5a4', 'a55ff99aafd022fd50c2d86d7a4fb38d', 'shautfol', 'San Francisco, CA', 'USA',
 'a', 'a', 'b','b','ACTIVE');

insert into loftu_groups (id, name, description, status, location, visibility, member_limit, admin_id)
values (1, 'Gardening', 'NJ Gardeneners', 'ACTIVE', 'San Francisco, CA', 
'PUBLIC', 10, 'fR7fqZg9TSePCJYjDB4NUqWmZAH2');

CREATE TABLE `loftu_group_members` (
  `group_member_id` int  PRIMARY KEY AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `member_id` varchar(255) NOT NULL,
  `status` varchar(10) DEFAULT 'ACTIVE',
  `subscribe_date` datetime DEFAULT NULL,
  `unsubscribe_date` datetime DEFAULT NULL,
  `member_type` varchar(45) DEFAULT NULL,
  `added_by` varchar(10) DEFAULT 'SELF',
  `created_by` varchar(255) DEFAULT NULL,  
  `modified_date` datetime DEFAULT NULL,  
  `modified_by` varchar(255) DEFAULT NULL,  
  INDEX groupmember_id (member_id),
  UNIQUE KEY `group_member` (`group_id`,`member_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `loftu_items` (
  `item_id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `subtitle` varchar(200) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `status` varchar(10) DEFAULT 'AVAILABLE',
  `owner_id` varchar(255) DEFAULT NULL,
  `owner_type` varchar(10) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `visibility` VARCHAR(10) DEFAULT 'PRIVATE',
  `location` varchar(45) DEFAULT NULL,
  `address1` varchar(100) DEFAULT NULL,
  `address2` varchar(100) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `state` varchar(45) DEFAULT NULL,
  `zipcode` varchar(45) DEFAULT NULL,
  `featured_desc1` longtext,
  `featured_desc2` longtext,
  `featured_desc3` longtext,
  `price` float DEFAULT NULL,
  `rental_cost` float DEFAULT NULL,
  `highlights` varchar(45) DEFAULT NULL,
  `min_rental_days` INT DEFAULT 1,
  `max_rental_days` INT,
  `pickup_lead_days` INT,
  `thumbnail_image` longtext,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT  NOW(), 
  `modified_by` varchar(255) DEFAULT NULL,   
  `modified_date` datetime DEFAULT NULL,  
   INDEX `owner_id` (`owner_id`),
  FULLTEXT KEY `title` (`title`),
  FULLTEXT KEY `subtitle` (`subtitle`),
  FULLTEXT KEY `title_2` (`title`,`subtitle`,`description`),
  FULLTEXT KEY `title_3` (`title`,`subtitle`,`description`)   
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `loftu_reservations` (
  `reservation_id` int primary key auto_increment,
  `item_id` int NOT NULL,
  `member_id` VARCHAR(255) NOT NULL,
  `reservation_status` VARCHAR(10) DEFAULT 'ACTIVE',
  `reservation_date` datetime NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  `item_pickup_date` datetime DEFAULT NULL,
  `item_return_date` datetime DEFAULT NULL,  
  `cancel_date` datetime DEFAULT NULL, 
  `cancel_reason` varchar(100), 
  `rental_cost` float DEFAULT NULL,  
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT  NOW(), 
  `modified_by` varchar(255) DEFAULT NULL,   
  `modified_date` datetime DEFAULT NULL,   
  INDEX reservation_item (item_id),
  INDEX reservation_memberid (member_id),
  FOREIGN KEY (item_id) REFERENCES loftu_items(item_id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES loftu_members(member_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `loftu_item_availability` (
  `availability_id` int primary key auto_increment,
  `item_id` int NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime DEFAULT NULL,
  INDEX reservation_item (item_id),
  FOREIGN KEY (item_id) REFERENCES loftu_items(item_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

create table `loftu_feedbacks` (
  `feedback_id` int primary key auto_increment,
  `feedback_type` VARCHAR(10) NOT NULL,
  `feedback_by` VARCHAR(255) NOT NULL,
  `feedback_object_id` INT NOT NULL,
  `feedback_object_type` VARCHAR(10) NOT NULL,
  `feedback_date` datetime NOT NULL,
  `feedback_subobject` VARCHAR(20),
  `feedback_text` VARCHAR(1000),
  `num_of_likes`  INT,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT  NOW(), 
  `modified_by` varchar(255) DEFAULT NULL,   
  `modified_date` datetime DEFAULT NULL, 
  INDEX loftu_feedback_object (feedback_object_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
create table `loftu_ratings` (
  `rating_id` int primary key auto_increment,
  `rating`    int not null,
  `rated_by` VARCHAR(255) NOT NULL,
  `rated_object_id` INT NOT NULL,
  `rated_object_type` VARCHAR(10) NOT NULL,
  `rated_date` datetime NOT NULL,
  `rated_subject` VARCHAR(20),
  `rated_text` VARCHAR(1000),
  `rated_ref_id`  INT,
  `rated_ref_type`  VARCHAR(20),  
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT  NOW(), 
  `modified_by` varchar(255) DEFAULT NULL,   
  `modified_date` datetime DEFAULT NULL, 
  INDEX loftu_rated_object (rated_object_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
 
 create table `loftu_categories` (
  `category_id` int primary key auto_increment,
  `name`    VARCHAR(30) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `status`      VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  `visibility`  VARCHAR(10) NOT NULL DEFAULT 'PUBLIC',
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime DEFAULT  NOW(), 
  `modified_by` varchar(255) DEFAULT NULL,   
  `modified_date` datetime DEFAULT NULL, 
  UNIQUE INDEX category_name (name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
   insert into `loftu_categories` (category_id, name, description, status, visibility, created_by) values (1, 'Kitchen', 'Cooking Related', 'ACTIVE', 
  'PUBLIC', 1);
  delete * from loftu_categories;
  
    insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (2, 'Hiking', 'Light Weight Hiking Items', 'ACTIVE', 
  'PUBLIC', 1);
    insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (3, 'Museums', 'Museum Passes', 'ACTIVE', 
  'PUBLIC', 1);
      insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (4, 'Video Games', 'Any computer game', 'ACTIVE', 
  'PUBLIC', 1);
    insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (6, 'Cooking', 'Includes backing', 'ACTIVE', 
  'PUBLIC', 1);
    insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (7, 'Garden', 'Includes seed swaps', 'ACTIVE', 
  'PUBLIC', 1);
    insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (8, 'Electronics', 'Everything under the earth', 'ACTIVE', 
  'PUBLIC', 1);
    insert into `loftu_categories` 
  (category_id, name, description, status, visibility, created_by) 
  values (9, 'Photography', 'Cameras, Video Recorders', 'ACTIVE', 
  'PUBLIC', 1);
  