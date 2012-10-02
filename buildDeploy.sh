#!/bin/bash
#chmod -R 777 ./deploy
#rm -rf ./deploy
#mkdir ./deploy
#mkdir ./deploy/cgi-bin
#mkdir ./deploy/images
#cp index.html ./deploy/
#cp ./cgi-bin/* ./deploy/cgi-bin/
#cp ./images/* ./deploy/images/
chmod -R 744 ./deploy
chmod -R 755 ./deploy/cgi-bin/* 
rm -rf ~/stage/golfuat20120601/*
cp -r db/* ~/stage/golfuat20120601/
rm -rf ~/stage/golfuat20120601/*.log

