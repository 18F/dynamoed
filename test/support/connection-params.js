'use strict'

module.exports = {
  accessKeyId:      process.env.AWS_ACCESS_KEY || "testdbname",
  secretAccessKey:  process.env.AWS_SECRET_KEY || "s3cret",
  region:           process.env.AWS_REGION     || "localhost",
  endpoint:         process.env.AWS_ENDPOINT   || "http://localhost:8000"
}
