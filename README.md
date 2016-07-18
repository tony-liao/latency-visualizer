# latency-visualizer
A graph visualization tool intended to display latencies between databases in cluster computing configurations. Built using [d3.js](https://d3js.org/) as part of my work in the iQua group at the University of Toronto.

The graph is stored in a redis database, accessed using ioredis and sent using socket.io.

## Features
- d3's force-directed graph self-adjusts to a readable arrangement
- Graph updates in real-time on database changes

## Usage
### Local use
1. Install [redis](http://redis.io/) and [node.js](https://nodejs.org/).
2. Clone this repository and install dependencies:

    ```shell
    $ git clone https://github.com/tony-liao/latency-visualizer.git
    $ npm install
    ```
    
3. Start the redis server and web server:

    ```shell
    $ ./<redis-installation>/src/redis-server
    $ node app.js
    ```

4. Open your browser to `localhost:3000`. Data can be edited in real-time using the redis command line tool at `<redis-installation>/src/redis-cli`.
