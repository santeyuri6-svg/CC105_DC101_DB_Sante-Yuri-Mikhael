-- Courses table
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  course_code VARCHAR(20) NOT NULL UNIQUE,
  course_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Sections table
DROP TABLE IF EXISTS sections;
CREATE TABLE sections (
  section_id INT AUTO_INCREMENT PRIMARY KEY,
  section_name VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- Students table
DROP TABLE IF EXISTS students;
CREATE TABLE students (
  student_id VARCHAR(20) PRIMARY KEY, -- allow custom student id string
  name VARCHAR(150) NOT NULL,
  course_id INT NOT NULL,
  year_level TINYINT NOT NULL,
  section_id INT NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  FOREIGN KEY (section_id) REFERENCES sections(section_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Insert sample courses (5)
INSERT INTO courses (course_code, course_name) VALUES
('BSCS','Bachelor of Science in Computer Science'),
('BSBA','Bachelor of Science in Business Administration'),
('BSN','Bachelor of Science in Nursing'),
('BSED','Bachelor of Secondary Education'),
('BACOMM','Bachelor of Arts and Communication');

-- Insert sample sections (5)
INSERT INTO sections (section_name) VALUES
('A'),('B'),('C'),('D'),('E');

-- Insert sample students (5)
INSERT INTO students (student_id, name, course_id, year_level, section_id) VALUES
('2025001','YURI MIKHAEL A. SANTE', 1, 1, 1),
('2025002','DONIVER M. RECANIA', 2, 2, 2),
('2025003','DAVEN D. DORADO', 3, 3, 3),
('2025004','ERL D. LEYNES', 4, 4, 4),
('2025005','JAYVEE P. ATON', 5, 1, 5);
