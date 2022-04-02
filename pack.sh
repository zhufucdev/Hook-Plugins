#!/bin/bash
for i in $(ls -d */)
do
    mkdir -p Package
    echo Packing $i
    zip -q -r ./Package/${i%/}.hplugin $i
done