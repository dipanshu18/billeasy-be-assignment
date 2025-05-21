## BillEasy Junior Backend Developer Assignment

### ENV VARS needed:

- `DATABASE_URL`
- `NODE_ENV`
- `PORT`
- `JWT_SECRET`
- `APP_ORIGIN`

### Project setup instructions

**Postman API docs**

https://documenter.getpostman.com/view/25745501/2sB2qZFhmp

**Local setup**

1. Change directory to server

`cd server`

2. Then, install dependencies with your choice of package manager (npm, yarn, pnpm) (pnpm preferred)

`pnpm install`

3. Copy `.env.example` to your own `.env`

`cp .env.example .env`

4. Populate with your env variables

5. Migrate changes to database

`pnpm db:deploy`

6. (Optional) If you want to seed data with random data, run

`pnpm seed`

Finally, backend will be available on

`http://localhost:PORT`

### Database Schema

![booksdb-erd](https://github.com/user-attachments/assets/6dc1ff4d-bad8-4626-9e58-4a520df6757e)

### Example API Requests

**POST => /auth/signup** *Creates a new user*

![01) User_Signup](https://github.com/user-attachments/assets/5df97b4f-0216-49e4-9a23-93af9e1c27a1)

**POST => /auth/login** *Login user*

![02) User Login](https://github.com/user-attachments/assets/fc11c7d2-6553-4041-91e2-b6c31401dacf)

**GET => /books?limit=5&page=1** *Get all books with pagination enabled*

![03) Get_All_Books](https://github.com/user-attachments/assets/a96088e2-f22e-4056-bbe8-1779e9eaeeca)

**POST => /books** *Add new book*

![04) Add Book](https://github.com/user-attachments/assets/d2f55324-121f-4bd9-9c0c-a139f83ea81e)

**GET => /books/:id** *Get book details by id with average rating and reviews*

![05) Get_Book_Details_with_Reviews_and_AvgRating](https://github.com/user-attachments/assets/884b6370-0d68-4615-b2da-d6840688cc1b)

**POST => /books/:id/reviews** *Submit a review*

![06) Submit Review](https://github.com/user-attachments/assets/cdb0ec0e-527a-4107-a5be-d398c11c31d4)

**PUT => /reviews/:id** *Update users own review*

![07) Update review](https://github.com/user-attachments/assets/970f969a-d8f3-4452-ba42-16709da7a5a4)

**DELETE => /reviews/:id** *Delete users own review*

![08) Delete Review](https://github.com/user-attachments/assets/dc871589-2b72-42d6-993d-7ad488e13b10)

**GET => /books/search?title=&author=Jeff&genre=FANTASY** *Search functionality either by title or author or genre*

![09) Search_Filters](https://github.com/user-attachments/assets/58b96aae-2d6b-4fd5-8dba-ad9b34d340e0)
