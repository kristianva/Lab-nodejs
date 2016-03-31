# Lab-nodejs

# Welcome to Lab-nodejs

Endpoints for Team

GET /team

Returns all the member involved on the Lab-nodejs

GET /team/member

Returns the info related to the member. If the member doesn't exists the app returns a 404 error code.

Endpoints for Students

GET /students

Returns a list of students. Each student has the follwing structure

id: string. The id of the student
name: string. The name of the student
address: string. The student's address
email: string. The student's email.
POST /students/

Creates a student. If success it returns a 201 HTTP code with a the id of the recently created resource as body. The body must be a valid JSON with the following structure.

name: string. The name of the student
address: string. The student's address
email: string. The student's email.
PUT /students/

Updates a student information. If success it returns a 200 HTTP code with. If the user is invalid it returns a 404 HTTP code. The body must be a valid JSON with the following structure.

id: string. The id of the student
name: string. The name of the student
address: string. The student's address
email: string. The student's email.
PATCH /students/

Updates a student information. If success it returns a 200 HTTP code with. If the user is invalid it returns a 404 HTTP code. The body must be a valid JSON with the following structure.

id(required): string. The id of the student
name(optional): string. The name of the student
address(optional): string. The student's address
email(optional): string. The student's email.
DELETE /students/:student

Deletes a student note from the records. The variable :student must be a valid user id. If the user is invalid it returns a 404 HTTP code. The body must be a valid JSON with the following structure.

Endpoints for Notes

GET /notes

Returns a list of students and its notes. Each student has the follwing structure

id: string. The id of the student
note: numeric. The student's note
GET /notes/:student

Returns the note for the specified student. If the student doesn't exists it returns a 404 HTTP status code.

POST /notes/:student

Creates a note for the specified student. If the student doesn't exists it returns a 404 HTTP status code. If the student already has a note it returns a 400 HTTP status code. For creating the note, the body of the request should include a JSON with the following structure

note: numeric. The note of the student
PUT /notes/:student

Updates a note for a student. If the student doesn't exists it returns a 404 HTTP status code. If the student already has a note it returns a 400 HTTP status code. For creating the note, the body of the request should include a JSON with the following structure

note: numeric. The note of the student
PATCH /notes/:student

Updates the note for a student. If the student doesn't exists it returns a 404 HTTP status code. If the student already has a note it returns a 400 HTTP status code. For creating the note, the body of the request should include a JSON with the following structure

note: numeric. The note of the student
