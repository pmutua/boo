# Documentation

This API documentation provides details about the endpoints or routes of the application.

## Running the application

To run the Express app with npm start, follow these instructions:

1. Make sure you have Node.js and npm installed on your machine.

2. Open a terminal or command prompt.

3. Navigate to the root directory of your Express app project.

4. Run the following command to install the required dependencies:

      `npm install`

5. Once the installation is complete, you can start the Express app by running the following:
    `npm start`

6. After running npm start, the Express app should start and listen for incoming requests on the specified port (usually port 3000 by default). You should see a message in the terminal indicating that the app is running.

## List of Routes

- GET /profiles/profile/:id
- POST /profiles/create_profile
- GET /api/comments
- GET /api/comments/recent
- GET /api/comments/most-likes
- POST /api/comments/create
- GET /api/comments/detail/:id
- POST /api/comments/like
- POST /api/comments/unlike

<hr>

## Get Profile by ID

Retrieve a profile by its ID and render the profile page.

### Route

`GET /profile/:id`

### Parameters

- `id` (required): The ID of the profile.

### Response

- 200 OK: Profile successfully fetched and profile page rendered.
- 400 Bad Request: Invalid profile ID.
- 404 Not Found: Profile not found.
- 500 Internal Server Error: Failed to fetch profile.

### Example Request

The response renders the profile page with the retrieved profile details.

`GET /profile/64b1473ce1e973d1265c7a5d`

![Screenshot profile page](public/static/screenshot.png)

## Create Profile

Create a new profile.

### Endpoint

`POST /api/profiles/create_profile`

### Request Payload

- `name` (required): The name of the profile.
- `description` (required): The description of the profile.
- `mbti` (required): The Myers-Briggs Type Indicator of the profile.
- `enneagram` (required): The Enneagram type of the profile.
- `variant` (required): The Enneagram variant of the profile.
- `tritype` (required): The Enneagram tritype of the profile.
- `socionics` (required): The Socionics type of the profile.
- `sloan` (required): The Sloan type of the profile.
- `psyche` (required): The psychological function of the profile.
- `temperaments` (required): The temperaments of the profile.
- `image` (required): The URL of the profile image.

### Response

- 201 Created: Profile successfully created.
- 400 Bad Request: Failed to create profile.

### Example Request

```bash
POST /api/profiles/create_profile

Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "description": "Lorem ipsum dolor sit amet",
  "mbti": "INTJ",
  "enneagram": "5w6",
  "variant": "Social",
  "tritype": "531",
  "socionics": "ILE",
  "sloan": "RLOAI",
  "psyche": "Introverted Thinking",
  "temperaments": "NT",
  "image": "https://placebeard.it/640x360"
}
```

## Comments Endpoints Documentation

This API documentation provides details about the endpoints available for managing comments.

#### Get Comments

Retrieve comments based on the specified query type.

#### Endpoint

`GET /comments`

##### Query Parameters

- `q` (required): The type of query ("mbti", "enneagram", or "zodiac").

##### Response

- 200 OK: Comments successfully fetched based on the query type.
- 400 Bad Request: Invalid query type.
- 500 Internal Server Error: Failed to fetch comments.

#### Example Request

`GET /comments?q=mbti`

#### Example Response

```json
[
  {
    "_id": "60db60c85c4c1c001f5279b2",
    "userId": "123",
    "mbti": "INTJ",
    "description": "Comment 1",
    "title": "Title 1",
    "profileId": "60db60c85c4c1c001f5279b2",
    "createdAt": "2021-07-01T12:34:56.789Z",
    "updatedAt": "2021-07-02T09:12:34.567Z"
  },
  {
    "_id": "60db60c85c4c1c001f5279b3",
    "userId": "456",
    "mbti": "INFJ",
    "description": "Comment 2",
    "title": "Title 2",
    "profileId": "60db60c85c4c1c001f5279b3",
    "createdAt": "2021-07-03T10:20:30.456Z",
    "updatedAt": "2021-07-04T15:16:17.234Z"
  }
]

```

#### Get Recent Comments

Retrieve recent comments with pagination.

#### Endpoint

`GET /api/comments/recent`

`

#### Query Parameters

page (optional): The page number for pagination. Defaults to 1.
limit (optional): The number of comments per page. Defaults to 10.

#### Response

200 OK: Recent comments successfully fetched.
500 Internal Server Error: Failed to fetch comments.

#### Example Request

`GET /api/comments/recent?page=1&limit=10`

#### Example Response

```json
[
  {
    "_id": "60db60c85c4c1c001f5279b2",
    "userId": "123",
    "mbti": "INTJ",
    "description": "Comment 1",
    "title": "Title 1",
    "profileId": "60db60c85c4c1c001f5279b2",
    "createdAt": "2021-07-01T12:34:56.789Z",
    "updatedAt": "2021-07-02T09:12:34.567Z"
  },
  {
    "_id": "60db60c85c4c1c001f5279b3",
    "userId": "456",
    "mbti": "INFJ",
    "description": "Comment 2",
    "title": "Title 2",
    "profileId": "60db60c85c4c1c001f5279b3",
    "createdAt": "2021-07-03T10:20:30.456Z",
    "updatedAt": "2021-07-04T15:16:17.234Z"
  }
]

```

#### Get Comments with Most Likes

Retrieve comments with the most number of likes.

### Endpoint

`GET /api/comments/most-likes`

### Query Parameters

page (optional): The page number for pagination. Defaults to 1.
limit (optional): The number of comments per page. Defaults to 10.

### Response

200 OK: Comments with the most number of likes successfully fetched.
500 Internal Server Error: Failed to fetch comments.

### Example Request

`GET /api/comments/most-likes?page=1&limit=10`

```json
[
  {
    "_id": "60db60c85c4c1c001f5279b2",
    "userId": "123",
    "mbti": "INTJ",
    "description": "Comment 1",
    "title": "Title 1",
    "profileId": "60db60c85c4c1c001f5279b2",
    "createdAt": "2021-07-01T12:34:56.789Z",
    "updatedAt": "2021-07-02T09:12:34.567Z"
  },
  {
    "_id": "60db60c85c4c1c001f5279b3",
    "userId": "456",
    "mbti": "INFJ",
    "description": "Comment 2",
    "title": "Title 2",
    "profileId": "60db60c85c4c1c001f5279b3",
    "createdAt": "2021-07-03T10:20:30.456Z",
    "updatedAt": "2021-07-04T15:16:17.234Z"
  }
]

```

### Create Comment

Create a new comment.

### Endpoint

`POST /api/comments/create`

### Request Body

- userId (required): The ID of the user creating the comment.
- mbti (optional): The MBTI type associated with the comment.
- enneagram (optional): The Enneagram type associated with the comment.
- zodiac (optional): The Zodiac sign associated with the comment.
- description (required): The description of the comment.
- title (required): The title of the comment.
- profileId (required): The ID of the associated profile.

### Response

- 201 Created: Comment successfully created.
- 400 Bad Request: Profile not found or failed to create comment.

### Example Request

```
POST /api/comments/create
Content-Type: application/json
```

```json

{
  "userId": "123",
  "mbti": "INTJ",
  "description": "Comment 1",
  "title": "Title 1",
  "profileId": "60db60c85c4c1c001f5279b2"
}

```

### Example Response

```json
{
  "_id": "60db60c85c4c1c001f5279b2",
  "userId": "123",
  "mbti": "INTJ",
  "description": "Comment 1",
  "title": "Title 1",
  "profileId": "60db60c85c4c1c001f5279b2",
  "createdAt": "2021-07-01T12:34:56.789Z",
  "updatedAt": "2021-07-02T09:12:34.567Z"
}

```

## Like Comment

Like a comment.

### Endpoint

`POST /api/comments/like`

#### Request Body

- `commentId` (required): The ID of the comment to like.
- `userId` (required): The ID of the user liking the comment.

#### Response

- 200 OK: Comment liked successfully.
- 400 Bad Request: User has already liked the comment.
- 500 Internal Server Error: Failed to like the comment.

### Example Request

```bash
POST /api/comments/like
Content-Type: application/json
```

```json
{
  "commentId": "60db60c85c4c1c001f5279b2",
  "userId": "123"
}
```

## Unlike Comment

Unlike a comment.

### Endpoint

`POST /api/comments/unlike`

#### Request Body

- `commentId` (required): The ID of the comment to unlike.
- `userId` (required): The ID of the user unliking the comment.

#### Response

- 200 OK: Comment unliked successfully.
- 500 Internal Server Error: Failed to unlike the comment.

### Example Request

```bash
  POST /api/comments/unlike
  Content-Type: application/json
```

```json
{
  "commentId": "60db60c85c4c1c001f5279b2",
  "userId": "123"
}
```

### Example Response

```json
{
  "message": "Comment unliked successfully"
}

```
