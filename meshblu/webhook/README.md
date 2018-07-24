# Webhook that receives forwarded messages

This is a web server that receives messages forwarded by devices and prints them to the console, as an example of how to build a webhook for Meshblu. It is included in the [cloud][../cloud] container.

## Quickstart

1. Follow the instructions provided in this [README.md](../README.md) to create the cloud.
1. Use the [device manager](../manager-socket.io) to create a device with message forwarding.
1. Start the device using one the device implementations in this repository.
1. Watch the container log for forwarded messages.
