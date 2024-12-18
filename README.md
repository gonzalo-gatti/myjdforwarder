# my JD Forwarder

This project facilitates adding links to a remote JDownloader instance running on a headless server (e.g., a Raspberry Pi) through MyJDownloader. Normally, when JDownloader runs locally, it listens on `http://127.0.0.1:9666/flash/addcrypted2` to handle `POST` requests and add encrypted downloads. However, when using a remote setup and MyJDownloader, this direct local endpoint is not accessible.

This forwarder solves that issue by running a small HTTP server on your local machine (inside a Docker container). When a link tries to send a `POST` request to `http://127.0.0.1:9666/flash/addcrypted2`, the container intercepts the request and forwards it to your remote server via SSH and `curl`, effectively adding the downloads to JDownloader as if it were running locally.

## How It Works

1.  Your browser or another application attempts to send a `POST` request with download parameters to `http://127.0.0.1:9666/flash/addcrypted2`.
2.  The local Docker container receives this `POST` request.
3.  The container extracts all the parameters from the request and constructs a `curl` command.
4.  Using SSH with user and password authentication, the container runs the `curl` command on the remote server where JDownloader is running headless.
5.  JDownloader adds the links to its download queue, just as it would if it were local.

## Requirements

*   Docker installed on your local machine.
*   A remote server running JDownloader, accessible via SSH.
*   SSH authentication by username and password enabled on the remote server.

## Environment Variables

*   `SSH_USER`: The SSH username for your remote server.
*   `SSH_HOST`: The hostname or IP address of your remote server.
*   `SSH_PASS`: The SSH password for that user.

These variables can be set when running the Docker container.

## Usage

1.  Clone this repository.
2.  Build the Docker image:
    ```
    docker build -t jd-forwarder .
    ```
3.  Run the container, passing your SSH credentials as environment variables:
    ```
    docker run -d -p 9666:9666 -e SSH_USER="youruser" -e SSH_HOST="yourserver.com" -e SSH_PASS="yourpassword" jd-forwarder --name "MyJDForwarder"
    ```
At this point, any request that tries to access `http://127.0.0.1:9666/flash/addcrypted2` on your local machine will be forwarded to the remote server over SSH, executing the curl command there and adding the links to JDownloader.