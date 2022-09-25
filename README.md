# Task 14

Now let's update the **frontend** to work with your changes to the backend from Task 13.

1. To start with, please **delete** all the documents from your "users" and "albums" collections (using Atlas in the browser or the Mongo shell). This will give us a fresh start with our new data structure. :-)

2. Now we want to change our **frontend** logic, so that when the user adds an album:

   - First, a `fetch` request is sent to create a new document in the "albums" collection, if the album hasn't been added before.
     - If this request is successful ("ok"), the response from the server will contain the `id` of the album the user added.
   - If the request is successful, we now want to make a **second** `fetch` request, to add the album's `id` to the user's `albums` array...

3. To start this change, go to your **frontend** repo and find the `fetch` request in `views/Albums.js`, made when the user adds a new album.

   - If that request **succeeds**, you should delete the current `alert` and replace it with a **second** `fetch` request, to the `/users/:id/albums` route you created in Task 13.
     - This second `fetch` request should be a `PATCH` request to your new route. A `PATCH` request means you want to update part of an existing document, and can be created in the same way as a `POST` request
     - In the `body` of your `PATCH` request, you should include the `id` received from the **first** `fetch` request (in the parsed server response).

4. Continuing your changes from Step 3:
   - if the **second** fetch request **succeeds**, you will receive back from the server an array containing the `id`s of all albums the user has added (including the latest one).
     - You should `map` this array to render a JSX list of the user's album `id`s.
     - See the **"success example"** GIF in the `exercises` channel to see how this should look in the browser.
     - (Don't worry - tomorrow we will go back to rendering each album's full details, not just its `id`!)
     - Finally, you should reset the state variables (this logic was originally part of the first `fetch` request)
   - If the **second** request **does not succeed**, handle this in the usual way, and display an `alert` to the user containing the error message received from the server.
     - See the **"failure example"** GIF for an example of a failed request - in this case, if the user tries to add an album already in their collection.
   - If you have any bugs, one tip is to check what the backend is sending in its response, compared to what you are trying to use in your frontend logic after receiving and parsing that response...

# Task 13

Let's start the day by changing our code to work with the new data structure - when a user creates an album:

- If it's the first time anyone has added the album, a new `Album` document is created in the `albums` collection.
- Whether it's the first time or not, the user gets a reference to the `Album` document (its `_id`) in their `albums` array.

1. Find the controller function for when a user adds a new album. This is already working, but you should add some extra logic:

   - If the album received in the request body **already exists** in the albums collection, there is no need to create it again. Simply send back the id of the **existing** album in the server's `response`.
   - Can you think of a good Mongoose method to use to find whether the same album already exists in the "albums" collection?
   - Don't forget to also include error handling!

2. Next, go to the `postAlbum` controller function (in `usersController.js`). Note that this is not needed any more, as creating an album is now handled by the `albumsPost` controller function (in `albumsController.js`).

   - Delete (1) the `postAlbum` controller function, and (2) its route in the `users` router!

3. Now create a **new** controller function in `usersController.js` called `updateAlbums`. This function will (1) receive the `id` of an album in the request body, (2) add that `id` to the current user's `albums` array, and (3) send back the updated `albums` array in the server response.

   - Before changing the user's document, you should check whether the `id` received in the request body is already in the user document's `albums` array.
     - If so, you should send back an error to the frontend with status code 409 ("Conflict") and a message clarifying that the album already exists in the user's list of albums.
     - **Important:** remember, the `id` received in the request body will be a **string**, but any `_id` found by a Mongoose method will be an **`ObjectId`** - a type of object! So be careful when comparing them to see if they are (loosly, not strictly) the same!
   - Don't forget to add error handling!
   - Finally, create a new route in your `users` router. This should handle `PATCH` requests to the URL `http://localhost:3001/users/:id/albums`, and forward any requests received to your new `updateUser` controller function.

4. When you are done, you can use **Postman** to check your changed routes if you have time. After lunch, we will next update the frontend!

# Task 12

Now, let's see if we can start inserting `Album` documents into the new `albums` collection. :-)

1. **For now**, this will mean we can no longer display a user's list of albums in the browser. So first, you should go to /`views/Albums.js` in your **frontend** directory, and comment out (not delete!) the `albums.map()` call in your JSX code.

   - Next week, we can talk more about creating a relationship between the `users` collection and the `albums` collection, so we can start displaying the user's albums in the browser again. :-)

2. Next, in your **backend** directory, you should create a new router in your `routes` directory called `albums.js` and export it. You do not need to define any routes yet.

   - You should `import` and register the router in `index.js`. Any request going to the `/albums` path should be redirected to this router.
   - Don't forget that you can look at your `users` router in case you want to check how you did this before!

3. In your new `albums` router, you should create a new `POST` route, which will receive requests to the `/` path. Do not yet assign a controller function to it...

4. Next, create a new file in your `controllers` directory called `albumsController.js`. In this, you should create and `export` a new controller function called `albumsPost`.

5. When the `albumsPost` controller function receives a request, the request `body` should contain the `albumTitle`, `albumYear` and `band` for the new album the logged-in user wants to create.

   - In the `albumsPost` controller function, declare a variable called `newAlbum`, and initialize it using the request `body`.
   - Next, import your new `Album` model, and use it to `save` a new document in the `albums` collection of your MongoDB database. Don't forget to add error handling using `http-errors`!
   - When this is done, you should send a response containing the `_id` of the album document you just created.

6. Finally, you should `import` your `albumsPost` controller function into the `albums` router you created in Step 2, and assign it to the route you created in Step 3.

7. Now, in your **frontend** directory, go to `/views/Albums.js`. When you click the button to create an album, you can keep the same logic to define your `POST` request, but now the request should be sent to `http://localhost:3001/albums` instead of the current URL.

   - When you receive back the response from the server:
     - If the request was **successful** ("ok"), you should **comment out** the `setAlbums` function call (as we are no longer receiving an array of albums in the response).
     - Instead, you should create an `alert` with the content: "New album created with id: [id_of_album]". You can use the parsed server response to show the new album's real id in place of the square brackets!
     - If the request was **unsuccessful**, you can handle this in the usual way.

8. Finally, you should log in and try to create an album:
   - Did you get the `alert` you expected?
   - If so, check the `albums` collection in your database. Is the album there?
   - If anything isn't working as expected, try to find and fix any bugs and then try again.

---

# Task 11

Let's start bringing relationships between collections into our backend logic!

First, we will need to create a new `Album` model, so that when a user creates a new album document, it can be inserted into a collection called `albums`.

1. Create a new file in your backend `models` directory called `album.js`. Inside this you should create a new `Album` model.
   - You can check out your `User` model in case you want to remember all the steps to create a Mongoose model.
   - The new `Album` model should link to a new **collection** in your MongoDB database called `albums`.
   - **Remember:** each album document should have **three** properties: `band` (String), `albumTitle` (String) and `albumYear` (Number). All are required.
   - You do not need to add any pre-save hooks or timestamps to your new `Album` schema. :-)
2. See if you can add extra **validators** to the `albumYear` property, so that an album's year cannot be less than 1900 or greater than 2022.
   - Researching Mongoose's "built in" validators for numbers will help you with setting minimum and maximum values!

---

# Task 10

Let's practice updating our "User" schema...

1. Make both the `username` and `emailAddress` address unique.

   - Once you have done this, you can go to the `registerPost` controller function (in `/controllers/registerController.js`), and remove the functionality to check whether a username has already been taken. The schema can handle this now.
   - Test your changes by trying to create two users with the same username. Also try to create two users with the same email address. In both cases, you should no longer be able to create the second user.
   - In both cases, it is ok to send the same error message to the frontend, e.g. "User could not be created. Please try again". Soon, we will look at how to identify the specific cause of an error. :-)

2. Use a pre-save hook to give some default values to your "User" documents.

   - If no first name is provided during registration, the default should be "John"
   - If no last name is provided during registration, the default should be "Doe"
   - Again, you should test your changes and make sure you get the expected result.

3. Make it so that each of your documents has `createdAt` and `updatedAt` properties.
   - To test this, you can create a new user, give them a new album and delete that album. After each of these steps, check the document in your database and make sure the "createdAt" and "updatedAt" properties look the way you would expect.

---

# Task 9

Lets finally explore how we can use Mongoose to **delete** a document from your collection!

## Part 1: Frontend

- Create a new component called `Deregister`. This should render a simple button with a `className` of `logout-btn`. Don't forget to export the new component.
- Import your new component into `/views/Albums.js` and render it to the right of the `<Logout />` component.
- Now, in **App.js**, create a new function called `deregister`. When called, this should:
  - Use `fetch` to send a HTTP DELETE request (using `async await` syntax) to `http://localhost:3001/users/[id_of_current_user]` (you will have to replace the part in square brackets yourself!).
  - For now you can just define the fetch request and put the server's response into a variable called `response`. We will deal with the actual server response later!
  - When you are done, you should pass a reference to your function down, using **props**, to the grandchild `Deregister` component. When you click the button rendered by `<Deregister />`, you should call the `deregister` function in `App.js`.

## Part 2: Backend

- Now, in the backend, we need to create a route to handle the request you just defined.
- Create the route in `routes/users.js`. Hint: keep an eye on the HTTP method you used in the request!
- Create a controller function called `deleteUser` in `/controllers/usersController.js`. Make sure this is called whenever a request is received by your new route.
- In your `deleteUser` controller function, use the new Mongoose method **`findByIdAndRemove`**. This takes just one argument - the **id** of the document to delete from the collection. It will then find that document and delete it!
  - Can you remember how to get the id of the user who sent the request from the request object?
- In case something goes wrong with your query, make sure to also add error handling using `http-errors`.
- Finally, if the query succeeds, send back a response to the frontend. The response should contain a JSON object with the following structure

```json
{ "message": "Your account has been successfully deleted. Come back soon!" }
```

## Part 3: Frontend

- Back in the `deregister` function in `App.js`, we now need to handle the server's response to your `fetch` request.
- If the response shows the request was **successful** ("ok"), display an alert with the message received in the response ("Your account has been successfully deleted. Come back soon!").
- Before you finish, also update the three state variables in App.js (in the following order) to:
  - "Log out of" the Albums view
  - Render the Login view instead
  - Set the value of the current user's id to an empty string
- However, if the response indicates the request was **unsuccessful**, simply display an alert with the message received in the response.

## Part 4: Testing

- Finally, test your new functionality by creating a new user. Use the Mongo shell to check the `users` collection - the new user's document should be there.
- Now try to delete the user!
  - Do you get the correct alert message? Are you then logged out automatically?
  - If so, try logging in as the same user. Does this still work?
  - If you can no longer log in, this is a good sign! Finally, use the Mongo shell to check if the user still exists in your `users` collection. They should not exist any more.
- If any of your testing gives an unexpected result, try to find and fix any bugs.

---

# Task 8

Now you can update the new `deleteAlbum` controller function in your backend to delete a specific album from the logged-in user's MongoDB document.

- In your controller function, you already have access to (1) the user's `id` and (2) the `id` of the album the user wants to delete.
- Next, create a new variable called `updatedUser`. Do not initialize it (give it a value) yet...
- Now, you should use what we have learned about Mongoose's `findByIdAndUpdate` method to try to remove **only** the selected album from the user's MongoDB document.
  - Make sure that, if this works, the **new** version of the user (minus one album) becomes the value of `updatedUser`.
  - If there is an error, you can, as usual, `catch` it and pass a new error object to the error handling middleware.
- **Some hints about how to remove one album:**
  - Remember how when we wanted to **add** an album using `findByIdAndUpdate`, we used the `$push` operator? There is another operator called `$pull` which may help!
  - However, after writing `$pull`, we do **not** want to find an album **object** equal to the `id` received from the frontend. Instead, we want to find an album object with an **`_id` key** equal to the `id` received from the frontend.
  - See if you can use what you already know about writing MongoDB query syntax to achieve this. If you are stuck, you can also use Google to research how to remove an **object** from an array using Mongoose and the `$pull` operator!
  - If you are still stuck after a while, we can also chat in a breakout room. :-)
- After you have successfully removed the album, you should send back **only** the user's updated `albums` array in the response to the frontend.
- Back in `/views/Albums.js` in the **frontend**, if the response received back from the server is successful ("ok") you should update the `albums` state variable with the parsed response.
- If the response received back from the server is not successful, you should handle this in the usual way (by showing an alert containing the error message received from the server).
  - **Hint** - You can check your other `Albums.js` functions for how to do this if you have forgotten. ;-)
- Finally, test your changes by creating and deleting different albums, and making sure you always get the result you expect. Fix any bugs you find.
  - **Hint:** Remember: both your browser console and VS Code terminals can help you identify any bugs in your code.

---

# Task 7

Let's prepare our project, so that soon we will be able to delete individual albums.

- You should start in `/views/Albums.js` in your **`frontend`** repo. When a user clicks the "X" next to an album, you should already be calling the `deleteOneAlbum` function and making a log of the album's `id`.
- Now update this function to send a DELETE HTTP request to your server, to the URL `http://localhost:3001/users/[user's id]/albums/[album's id]`. You should replace `[user's id]` and `[album's id]` with the correct variables, using template literals (e.g. `${aVariable}`).
  - When creating your `fetch` request, the `settings` object only needs a `method` property, with the value "DELETE". You will not send any data in your request.
  - Also remember to use your `REACT_APP_SERVER_URL` environment variable instead of `http://localhost:3001`!
- Now go to your **`backend`** repo. Add an extra `delete` **route** to your `/routes/users.js` router which will receive the request from the frontend to delete one album.
  - Remember that the path will have two **parameters** (:) - one for the user's id, and one for the id of the album they want to delete.
- The request will be forwarded on to a **new** controller function in `/controllers/usersController.js` called `deleteAlbum`. Create this function (and remember to `export` it so you can `import` and use it in your router!)
  - For now, the function should simply `console.log`(1) the user's id and (2) the album id using the **parameters** of the request object.
  - You should also send a response back to the frontend containing the string "Album deleted!".
- Finally, go back to `/views/Albums.js` in your **`frontend`** repo. Now you will need to handle the response from the server:
  - If the response you receive back from the server is successful ("ok"), you can make an `alert` containing the parsed response ("Album deleted!").
  - If the response received back from the server is not successful, you can make an `alert` containing the string "Unsuccessful request!".
- Now test your new functionality by creating two new albums album, clicking the "X" next to one of them, and seeing what happens! Fix any bugs you find.
  - **Hint:** Remember: both your browser console and VS Code terminals can help you identify any bugs in your code.

---

# Task 6

Let's practice using `findByIdAndUpdate` once more, by refactoring our final controller function - the one which deletes all the logged-in user's albums when they click the "Delete all albums!" button in the browser.

- You shouldn't need to change any of your frontend code.
- In the backend, you should go to the `deleteAlbums` controller function in `/controllers/usersController.js`.
- Refactor the function so you are using your `User` model to update the `users` collection of the MongoDB database `albums-project`. There should be no more lowdb code in your controller function.
  - **Hint:** You no longer need to find the index of the user before updating their `albums` array. You only need to know the user's `id` - the clue is in the name `findByIdAndUpdate`!
  - Make sure to return the correct data back to the frontend in your response (note what you are currently sending back after updating `db.json`).
  - Also remember to use `http-errors` to handle any errors in your controller function.
- When you are done, make sure to test your new function by creating some new albums in the browser, and trying to delete them.
- If this is all working, you can now delete any remaining lowdb code from your controller functions! You can also delete the `/data` directory, as we are now only using MongoDB as our database solution. :-)
- Finally, let's update our `backend` repo's dependencies by using `npm uninstall` to uninstall `lowdb` and `uuid`.

---

# Task 5

Now you should try to use your `User` model, and Mongoose's `findByIdAndUpdate` method, to make the `postAlbum` controller function work with your MongoDB database instead of `db.json`:

- You can find the controller function in `/controllers/usersController.js`.
- When you are done, you should be able to create new albums for the logged in user by clicking the "Submit Album" button in your browser.
- Remember that the new albums should be created in the `users` collection of the MongoDB database `albums-project`. There should be no more lowdb code in your controller function!
- Don't forget to also use `http-errors` for your error handling.
- When you are done, make sure to also test to make sure your error handling is working correctly!

---

# Task 4

Let's update our error handling to use the new `http-errors` module.

**Remember**: so far we have updated:

- The `registerPost()` controller function in `/controllers/registerController.js` (handle a HTTP request sent by a user who is trying to register)
- The `loginPost()` controller function in `/controllers/loginController.js` (handle a HTTP request sent by a user who is trying to log in)
- The `getUserData()` controller function in `/controllers/usersController.js` (handle a HTTP request sent when Albums.js first renders to GET the current user's first name and list of albums)

1. Use npm to install the `http-errors` module.
2. Change your error handling in all your updated controller functions to use the `http-errors` module.
   - I showed you two ways you can do this - feel free to choose your favourite!
   - If you need to research anything (e.g. different "named" errors), you can check out the `http-errors` docs at https://www.npmjs.com/package/http-errors
   - When you are done, you can test your new error handling by:
     - Trying to register but leaving one or more inputs blank
     - Trying to log in as an unregistered user
   - If you have some time at the end, you can comment out your new error handling and practice the other way of using `http-errors` that I showed you. When you are done, feel free to go back to the way you prefer. :-)

---

---

# Task 3

Now you can register a new user successfully, you should now refactor your code to make sure an existing user can **log in** successfully.

- You can start in `/views/Login.js` (**frontend**) to follow the process for logging in.
- When refactoring your **backend** controller function to handle logging in, remember that we are now using MongoDB and Mongoose to handle your data, not `/data/db.json` and lowdb.
  - In your controller function, also remember to add error handling whenever you use Mongoose to query your MongoDB collection.
- When you are done, use your browser to log in (1) as an existing user and (2) a user who doesn't exist. Make sure you get the expected outcome in both cases.

---

# Task 2

Now your User model is working when you send requests using Postman, make sure you can also register using your **React frontend**.

Remember, to register using your frontend, you need to complete the React form and click "Register an account". Once the button has been clicked, there are **2 stages**:

- **Stage 1**: in `/views/Register.js` (**frontend**), send a HTTP POST request to your server's "/register" path. The `registerPost` controller function for this endpoint (**backend**) should create a new user document in your database and send back a 201 response containing a copy of the new document. **If you completed yesterday's task, this should already work!**

  - You can check this by registering a new user in your browser. Even though you will get an error message, if you check you MongoDB shell / Compass, you will see the user was created. :-)
  - Note that in the `registerPost` controller function (**backend**), when the 201 response is sent you include a copy of the **whole** new document (username, password etc...).
  - But also note that in `/views/Register.js` (**frontend**), you **only** use the user's unique id from the response. The rest of the data is not needed!
    - Change `/controllers/registerController.js` (**backend**) to send back **only** a unique "id" for the user.
    - Be careful with what you are sending back here! Check out your new document in the MongoDB Shell / Compass if you are unsure...
    - Also make sure in `/views/Register.js` (**frontend**) that you are using **exactly** what you receive in the server response to set the `currentUserId` state variable in `App.js`!

- **Stage 2**: Next, the `Albums` view will be rendered in the browser. As soon as the view is rendered, a `useEffect` will be called to your server's GET /user endpoint to retrieve the necessary details about the user who just registered.
  - You do not need to change the `useEffect` in `/views/Albums.js` (**frontend**). Instead, refactor ("rewrite") your **backend** code to make sure the `fetch` request in the `useEffect` is successful.
  - Remember: your data now lives in MongoDB, not `db.json`!
  - In the controller function (**backend**) for the GET /user route, try to research and implement the new Mongoose method **Model.findById()** to find the correct user document using its id.
  - You can tell if your changes have worked because you will see "Welcome [user's firstname]!" in the top-left corner of the `Albums` view.
  - Make sure you are still also sending back the user's `albums` array from the backend, even though a newly registered user will not have any albums at the moment.
  - Finally, make sure to add error handling (like yesterday) whenever you use Mongoose to query your MongoDB collection.

---

# Task 1

Create and implement a "User" model in the `backend` directory of your new "Albums Project v2" repo!

For now, we will only implement the model when we want to **register** a new user.

## Instructions

1. Install `mongoose` into the `backend` directory of your "albums project v2" repo using npm.
2. Use mongoose in `index.js` to connect to a db called "albums-project" in MongoDB.
3. Inside the `backend` directory, create a `models` directory and add a file called `User.js`.
4. In `User,js`, import `mongoose` and use it to create a **schema** to define how a "User" document should look in your database.
   - What keys do you need to create a "User" document? Also, make sure all the keys are required!
5. Create a **model**, based on the schema, to provide an interface to a collection called `users`.
6. Import your model into `/controllers/registerController.js`.
7. Rewrite the `registerPost` controller function to use your model!
   - New "user" documents should now be saved in the `users` collection of your MongoDB database, instead of the `/data/db.json` file. To do this, you will need to use your **model** to replace all parts of the function currently using LowDB.
   - Remove all parts of the code which are no longer relevant (e.g. imports which are no longer needed, anything we do not need to handle ourselves as MongoDB will automatically handle it...)
   - Make sure to also add extra **error handling**, in case something goes wrong when using your model to:
     - find your user, or
     - save your user.
8. Test your changes using **Postman**.
   - Make sure that when you create a user correctly, you receive back a response containing that user's details, **plus**, `albums`, `_id` and `_v` fields.
   - Also try to create a user document without some of the correct fields, and make sure your error handling is working as expected.
   - You can look in the "exercises" Slack channel for examples of how successful and unsuccessful responses should look in Postman. :-)

---

Please copy all tasks into this file! This will create a record of the work you did to complete the project.

Each new task should go to the top of the file. :-)
