#!/bin/bash
forever stopall
npm install
forever -w start server.js

