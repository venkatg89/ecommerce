#!/bin/bash

# Apply the package patches node_modules
npx patch-package

# Pod install
cd ./ios && pod install 
cd ..
