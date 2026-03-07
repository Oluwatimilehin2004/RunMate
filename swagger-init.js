
window.onload = function() {
  // Build a system
  var url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  var options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "info": {
      "title": "Auth API",
      "version": "1.0.0",
      "description": "User authentication and profile management"
    },
    "tags": [
      {
        "name": "Auth",
        "description": "Authentication and user management"
      },
      {
        "name": "Orders",
        "description": "Order management for vendors"
      }
    ],
    "servers": [
      {
        "url": "https://hackathon-pjge.onrender.com/api",
        "description": "production server"
      },
      {
        "url": "http://localhost:5000/api",
        "description": "development server"
      }
    ],
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      },
      "schemas": {
        "ErrorResponse": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "example": false
            },
            "message": {
              "type": "string"
            }
          }
        },
        "SuccessResponse": {
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean",
              "example": true
            },
            "message": {
              "type": "string"
            },
            "data": {
              "type": "object"
            }
          }
        }
      }
    },
    "paths": {
      "/users/register": {
        "post": {
          "summary": "Register a new user",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "fullName",
                    "email",
                    "password",
                    "phoneNumber",
                    "roles"
                  ],
                  "properties": {
                    "fullName": {
                      "type": "string",
                      "example": "John Doe"
                    },
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "john@example.com"
                    },
                    "password": {
                      "type": "string",
                      "format": "password",
                      "example": "password123"
                    },
                    "phoneNumber": {
                      "type": "string",
                      "example": "+2348012345678"
                    },
                    "roles": {
                      "type": "string",
                      "enum": [
                        "vendor",
                        "runner",
                        "rider"
                      ],
                      "example": "rider"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": true
                      },
                      "message": {
                        "type": "string",
                        "example": "User created successfully"
                      },
                      "data": {
                        "type": "object",
                        "properties": {
                          "token": {
                            "type": "string",
                            "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "Bad request (missing fields, invalid role, user exists)",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean",
                        "example": false
                      },
                      "message": {
                        "type": "string",
                        "example": "Invalid role selected"
                      }
                    }
                  }
                }
              }
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/users/login": {
        "post": {
          "summary": "Login a user",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "password"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email",
                      "example": "john@example.com"
                    },
                    "password": {
                      "type": "string",
                      "example": "password123"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Login successful",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  },
                  "example": {
                    "success": true,
                    "message": "User logged in successfully",
                    "data": {
                      "user": {
                        "_id": "670f1a2b3c4d5e6f7a8b9c0d",
                        "firstName": "John",
                        "lastName": "Doe"
                      },
                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                  }
                }
              }
            },
            "401": {
              "description": "Invalid credentials"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/users/verify/{otp}": {
        "get": {
          "summary": "Verify user with OTP",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "otp",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "Verification OTP"
            }
          ],
          "responses": {
            "200": {
              "description": "User verified successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            },
            "400": {
              "description": "Token expired or invalid"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/users/user": {
        "get": {
          "summary": "Get current user details",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "User fetched",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  },
                  "example": {
                    "success": true,
                    "message": "User fetched",
                    "data": {
                      "user": {
                        "_id": "670f1a2b3c4d5e6f7a8b9c0d",
                        "firstName": "John"
                      }
                    }
                  }
                }
              }
            },
            "400": {
              "description": "User does not exist"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/users/resend": {
        "get": {
          "summary": "Resend verification OTP",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Verification email sent",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            },
            "400": {
              "description": "User already verified"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/users/reset/{email}": {
        "get": {
          "summary": "Send password reset OTP",
          "tags": [
            "Auth"
          ],
          "parameters": [
            {
              "name": "email",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string",
                "format": "email"
              },
              "description": "User's email"
            }
          ],
          "responses": {
            "200": {
              "description": "Password reset OTP sent",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            },
            "400": {
              "description": "User not found"
            },
            "500": {
              "description": "Server error or email sending failure"
            }
          }
        }
      },
      "/users/reset": {
        "post": {
          "summary": "Reset user pin",
          "tags": [
            "Auth"
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "email",
                    "otp",
                    "newPassword"
                  ],
                  "properties": {
                    "email": {
                      "type": "string",
                      "format": "email"
                    },
                    "otp": {
                      "type": "string"
                    },
                    "newPassword": {
                      "type": "string",
                      "example": "password123"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Password reset successful",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            },
            "400": {
              "description": "User not found"
            },
            "401": {
              "description": "Token expired"
            },
            "403": {
              "description": "Incorrect token"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/users/deleteMe": {
        "delete": {
          "summary": "Delete (deactivate) current user account",
          "description": "Soft deletes the authenticated user's account.\nThe user record is retained for admin monitoring,\nbut the email is released for future re-registration.\n",
          "tags": [
            "Auth"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Account deleted successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  },
                  "example": {
                    "success": true,
                    "message": "Account deleted successfully"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized (invalid or missing token)",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "message": "Unauthorized"
                  }
                }
              }
            },
            "404": {
              "description": "User not found",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ErrorResponse"
                  },
                  "example": {
                    "success": false,
                    "message": "User not found"
                  }
                }
              }
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/orders": {
        "post": {
          "summary": "Vendor creates a new order",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "customerName",
                    "items",
                    "deliveryLocation",
                    "paymentMethod"
                  ],
                  "properties": {
                    "customerName": {
                      "type": "string",
                      "example": "Jane Doe"
                    },
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": {
                            "type": "string",
                            "example": "Burger"
                          },
                          "quantity": {
                            "type": "number",
                            "example": 2
                          }
                        }
                      }
                    },
                    "deliveryLocation": {
                      "type": "string",
                      "example": "12 Admiralty Way, Lekki"
                    },
                    "paymentMethod": {
                      "type": "string",
                      "enum": [
                        "cash",
                        "transfer",
                        "card"
                      ],
                      "example": "cash"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "Order created successfully"
            },
            "400": {
              "description": "Bad request"
            },
            "403": {
              "description": "Only vendors can create orders"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      },
      "/orders/vendor": {
        "get": {
          "summary": "Get all orders created by the vendor",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Orders fetched successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            }
          }
        }
      },
      "/orders/available": {
        "get": {
          "summary": "Get all available deliveries for runners",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Available orders fetched",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            }
          }
        }
      },
      "/orders/{id}/accept": {
        "patch": {
          "summary": "Runner accepts an order",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Order accepted successfully"
            },
            "404": {
              "description": "Order not found"
            }
          }
        }
      },
      "/orders/{id}/picked": {
        "patch": {
          "summary": "Runner marks order as picked",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Order marked as picked"
            },
            "404": {
              "description": "Order not found"
            }
          }
        }
      },
      "/orders/{id}/delivered": {
        "patch": {
          "summary": "Runner marks order as delivered",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Order delivered successfully"
            },
            "404": {
              "description": "Order not found"
            }
          }
        }
      },
      "/orders/{id}/confirm-delivery": {
        "patch": {
          "summary": "Confirm delivery using the delivery code",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": [
                    "code"
                  ],
                  "properties": {
                    "code": {
                      "type": "string",
                      "example": "123456"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Delivery confirmed successfully"
            },
            "400": {
              "description": "Invalid delivery code"
            },
            "404": {
              "description": "Order not found"
            }
          }
        }
      },
      "/orders/{id}": {
        "delete": {
          "summary": "Vendor deletes their order",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "parameters": [
            {
              "name": "id",
              "in": "path",
              "required": true,
              "schema": {
                "type": "string",
                "example": "6652a10f3c2d8e001fabc123"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Order deleted successfully"
            },
            "400": {
              "description": "Cannot delete order that has been picked or delivered"
            },
            "403": {
              "description": "Not authorized to delete this order"
            },
            "404": {
              "description": "Order not found"
            }
          }
        }
      },
      "/orders/my-accepted": {
        "get": {
          "summary": "Get all orders accepted by the runner",
          "tags": [
            "Orders"
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "responses": {
            "200": {
              "description": "Accepted orders fetched successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SuccessResponse"
                  }
                }
              }
            },
            "403": {
              "description": "Only runners allowed"
            },
            "500": {
              "description": "Server error"
            }
          }
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  var urls = options.swaggerUrls
  var customOptions = options.customOptions
  var spec1 = options.swaggerDoc
  var swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (var attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  var ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.oauth) {
    ui.initOAuth(customOptions.oauth)
  }

  if (customOptions.preauthorizeApiKey) {
    const key = customOptions.preauthorizeApiKey.authDefinitionKey;
    const value = customOptions.preauthorizeApiKey.apiKeyValue;
    if (!!key && !!value) {
      const pid = setInterval(() => {
        const authorized = ui.preauthorizeApiKey(key, value);
        if(!!authorized) clearInterval(pid);
      }, 500)

    }
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }

  window.ui = ui
}
