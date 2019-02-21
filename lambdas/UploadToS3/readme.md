This is a partial working upload of S3.
Currently there is a hardcoded value called "Something.jpg" acting as the key for upload. This can be dynamically changed
when we hook this up to a rest API. This means the upload will only work with jpegs.

You can test the upload by going to the lambda function and generating an upload URL and using the following Command:

curl -v --upload-file '<image.jpg>' '<presignedURL'>

Note that I am using a bucket called uploadbuckettestcsc8109. This is based in us-east-1, alot of the services
work better when using this region.
