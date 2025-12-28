
Student Listing System 
its all about listing student information inside of school in defferent department.

components(Frontend + PHP Backend)
- frontend/index.html        (HTML + JS frontend)
- frontend/style.css         (CSS for the frontend)
- frontend/script.js         (JavaScript for frontend interactions)
- backend/db_store.php       (DB configuration - edit to match your MySQL credentials)
- backend/db_caller.php      (DB connection helper)
- backend/crud.php           (Single PHP endpoint handling CRUD operations via `action` parameter)


TABLE
students
student id   -  INT      -  unique identifier
name         -  VARCHAR  -  student name
course       -  VARCHAR  -  name of course
yearlevel    -  INT      -  students year level
section      -  INT      - section of students

course
course id    -  INT      - course unique identifier 
course name  -  VARCHAR  - name of course

section
section id   - INT       - unique identifier of section
section name - LETTER    - name of section

RELATIONSHIP
course can have many section and one section can have many students.
course (1)---------(N)sections
section (1)---------(N)students





