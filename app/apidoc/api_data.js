define({ "api": [
  {
    "type": "get",
    "url": "/search",
    "title": "Search for user",
    "name": "GetSearch",
    "group": "Search",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "keyword",
            "description": "<p>Keyword to search</p> "
          }
        ]
      }
    },
    "description": "<p>The main query entrance for searching user.</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Object[]</p> ",
            "optional": false,
            "field": "users",
            "description": "<p>A list of matched users</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Search"
  },
  {
    "type": "post",
    "url": "/tokens",
    "title": "Request token for user",
    "name": "GetToken",
    "group": "Token",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Mandatory user email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Mandatory password</p> "
          }
        ]
      }
    },
    "description": "<p>Fetch an authorization token for user with correct username and password</p> ",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Authentication token for the user</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response",
          "content": "HTTP/1.1 200 OK\n{ \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciO(...)\" }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "422",
            "description": "<p>Invalid username password combination</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 422 Unprocessable Entity\n{ \"error\": \"User's email not found\" }\nor\n{ \"error\": \"Invalid password\" }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Token"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Create a new user",
    "name": "CreateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "email",
            "description": "<p>Mandatory email</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "password",
            "description": "<p>Mandatory password</p> "
          }
        ]
      }
    },
    "description": "<p>Create a new user by using email, user name and password</p> ",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "message",
            "description": "<p>Message of successfullt created</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/educations",
    "title": "Create education experience for user",
    "name": "CreateUserEducation",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "school",
            "description": "<p>School name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "start",
            "description": "<p>Education start year</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "end",
            "description": "<p>Education end year</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "field",
            "description": "<p>Field of study</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "degree",
            "description": "<p>Degree of this education</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Token of a specific user</p> "
          }
        ]
      }
    },
    "description": "<p>This method could only be called with token in the header, the server will get the corresponding user for this method, and add this new education experience to him/her.</p> ",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "education",
            "description": "<p>Recently created education</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{ \n    education: { \n        school: \"Peking University\",\n        start:  \"2012\",\n        end:    \"2016\",\n        field:  \"Computer Science\",\n        degree: \"Bachelor\",\n        user_id:\"55d8c2b4227db5b920e05c18\"\n    }, \n    \"_id\":\"55d8c4860b52c9a925e24b97\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/works",
    "title": "Create work experience for user",
    "name": "CreateUserWork",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "company",
            "description": "<p>Company name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "start",
            "description": "<p>Work experience start year</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "end",
            "description": "<p>Work experience end year</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "position",
            "description": "<p>Position in the comany</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "industry",
            "description": "<p>Company's industry</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "token",
            "description": "<p>Token of a specific user</p> "
          }
        ]
      }
    },
    "description": "<p>This method could only be called with token in the header, the server will get the corresponding user for this method, and add this new work experience to him/her.</p> ",
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "<p>Object</p> ",
            "optional": false,
            "field": "work",
            "description": "<p>Recently created work</p> "
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{ \n    work: { \n        company:    \"Morgan Stanley\",\n        start:      \"2012\",\n        end:        \"2016\",\n        position:   \"Stuff\",\n        industry:   \"Financial\",\n        user_id:    \"55d8c2b4227db5b920e05c18\"\n    }, \n    \"_id\":\"55d8c6d9b990e0122b78de95\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get a list of existing users",
    "name": "GetUsers",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "role",
            "description": "<p>Select users by role name, like student or teacher</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "User"
  },
  {
    "type": "patch",
    "url": "/users",
    "title": "Update user profile",
    "name": "UpdateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "role",
            "description": "<p>Update user's role</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "name",
            "description": "<p>Update user's name</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "location",
            "description": "<p>Update user's location</p> "
          },
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": true,
            "field": "description",
            "description": "<p>Update user's description</p> "
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "<p>Number</p> ",
            "optional": false,
            "field": "modified",
            "description": "<p>Number of fields modified</p> "
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "User"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p> "
          },
          {
            "group": "Success 200",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p> "
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "app/apidoc/main.js",
    "group": "_home_ubuntu_workspace_app_apidoc_main_js",
    "groupTitle": "_home_ubuntu_workspace_app_apidoc_main_js",
    "name": ""
  }
] });