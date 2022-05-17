#!/bin/bash

cat >post_serviceName.json <<EOL
{
  "\$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ServiceNameSchema",
  "description": "Payload body",
  "type": "object",
  "properties": {
    "foo": {
      "type": "string"
    },
    "bar": {
      "type": "object"
    },
    "id": {
      "type": "number"
    },
    "sortKey": {
      "type": "number"
    }
  },
  "required": ["id", "sortKey"]
}
EOL