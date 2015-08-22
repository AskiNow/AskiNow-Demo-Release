define({ "api": [
  {
    "type": "post",
    "url": "/tokens",
    "title": "Request token for user",
    "name": "PostToken",
    "group": "Token",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "<p>String</p> ",
            "optional": false,
            "field": "name",
            "description": "<p>Mandatory user name</p> "
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
          "title": "Success-Response ",
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
          "content": "HTTP/1.1 422 Unprocessable Entity\n{ \"error\": \"User not found\" }\nor\n{ \"error\": \"Invalid password\" }",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "curl -i -X POST -d \"name=[username]&password=[password]\" \\\n    http://api.askinow.com/v1/tokens",
        "type": "curl"
      }
    ],
    "version": "0.0.0",
    "filename": "app/routes/api.js",
    "groupTitle": "Token"
  }
] });